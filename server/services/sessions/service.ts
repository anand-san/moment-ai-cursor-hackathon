import { Timestamp } from '../firebase';
import { sessionDocRef, newSessionDocRef } from './refs';
import type { SessionDocRaw, TipDoc } from './types';
import type {
  Analysis,
  SessionWithId,
  SwipeDirection,
  TipTag,
  ValuableTip,
} from '@sandilya-stack/shared/types';
import { sessionsCollection } from './collection';

export async function createSession(input: {
  userId: string;
  text: string;
}): Promise<{ id: string; text: string; createdAt: string }> {
  const docRef = newSessionDocRef(input.userId);
  const now = Timestamp.now();

  const data: SessionDocRaw = {
    text: input.text,
    createdAt: now,
    analysis: null,
    previousTips: [],
  };

  await docRef.set(data);

  return {
    id: docRef.id,
    text: input.text,
    createdAt: now.toDate().toISOString(),
  };
}

export async function getSession(input: {
  userId: string;
  sessionId: string;
}): Promise<SessionWithId | null> {
  const snap = await sessionDocRef(input.userId, input.sessionId).get();
  if (!snap.exists) return null;

  const data = snap.data();
  if (!data) return null;

  return {
    id: input.sessionId,
    text: data.text,
    createdAt: data.createdAt.toDate().toISOString(),
    analysis: data.analysis,
    previousTips: data.previousTips.map(
      (batch: SessionDocRaw['previousTips'][number]) => ({
        generatedAt: batch.generatedAt.toDate().toISOString(),
        tips: batch.tips,
      }),
    ),
  };
}

export async function updateSessionAnalysis(input: {
  userId: string;
  sessionId: string;
  analysis: Analysis;
}): Promise<boolean> {
  const docRef = sessionDocRef(input.userId, input.sessionId);
  const existing = await docRef.get();
  if (!existing.exists) return false;

  const current = existing.data();
  if (!current) return false;

  const next: SessionDocRaw = {
    ...current,
    analysis: input.analysis,
  };

  await docRef.set(next);
  return true;
}

export async function updateTipSwipe(input: {
  userId: string;
  sessionId: string;
  tipId: string;
  direction: SwipeDirection;
}): Promise<{ success: boolean; tag?: TipTag }> {
  const docRef = sessionDocRef(input.userId, input.sessionId);
  const existing = await docRef.get();
  if (!existing.exists) return { success: false };

  const current = existing.data();
  if (!current || !current.analysis) return { success: false };

  // Find the tip in current analysis
  const tipIndex = current.analysis.tips.findIndex(
    (t: TipDoc) => t.id === input.tipId,
  );
  if (tipIndex === -1) {
    // Check in previousTips
    for (const batch of current.previousTips) {
      const prevTipIndex = batch.tips.findIndex(
        (t: TipDoc) => t.id === input.tipId,
      );
      if (prevTipIndex !== -1) {
        batch.tips[prevTipIndex].swipeDirection = input.direction;
        await docRef.set(current);
        return {
          success: true,
          tag: batch.tips[prevTipIndex].tag as TipTag,
        };
      }
    }
    return { success: false };
  }

  // Update the tip's swipe direction
  current.analysis.tips[tipIndex].swipeDirection = input.direction;
  await docRef.set(current);

  return {
    success: true,
    tag: current.analysis.tips[tipIndex].tag as TipTag,
  };
}

export async function regenerateTips(input: {
  userId: string;
  sessionId: string;
}): Promise<{ currentAnalysis: Analysis | null } | null> {
  const docRef = sessionDocRef(input.userId, input.sessionId);
  const existing = await docRef.get();
  if (!existing.exists) return null;

  const current = existing.data();
  if (!current) return null;

  // Move current tips to previousTips
  if (current.analysis) {
    current.previousTips.push({
      generatedAt: Timestamp.now(),
      tips: current.analysis.tips,
    });
  }

  // Clear current analysis (new one will be set after AI generates)
  current.analysis = null;

  await docRef.set(current);

  return { currentAnalysis: null };
}

export async function getValuableTips(input: {
  userId: string;
}): Promise<ValuableTip[]> {
  // Get all sessions for the user
  const snap = await sessionsCollection(input.userId)
    .where('analysis', '!=', null)
    .get();

  const valuableTips: ValuableTip[] = [];

  for (const doc of snap.docs) {
    const data = doc.data() as SessionDocRaw;
    const sessionId = doc.id;
    const sessionText = data.text;

    // Check current analysis tips
    if (data.analysis) {
      for (const tip of data.analysis.tips) {
        if (tip.swipeDirection === 'right') {
          valuableTips.push({
            id: tip.id,
            content: tip.content,
            tag: tip.tag,
            sessionId,
            sessionText,
          });
        }
      }
    }

    // Check previousTips
    for (const batch of data.previousTips) {
      for (const tip of batch.tips) {
        if (tip.swipeDirection === 'right') {
          valuableTips.push({
            id: tip.id,
            content: tip.content,
            tag: tip.tag,
            sessionId,
            sessionText,
          });
        }
      }
    }
  }

  return valuableTips;
}
