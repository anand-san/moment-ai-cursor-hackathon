import { Timestamp } from '../firebase';
import { preferencesDocRef } from './refs';
import type { PreferencesDocRaw } from './types';
import type { TagCounts, TipTag } from '@sandilya-stack/shared/types';
import { defaultTagCounts } from '@sandilya-stack/shared/types';

export async function getPreferences(userId: string): Promise<TagCounts> {
  const docRef = preferencesDocRef(userId);
  const snap = await docRef.get();

  const data = snap.exists ? snap.data() : null;

  // Create default preferences if doc doesn't exist or tagCounts is missing
  if (!data || !data.tagCounts) {
    const newPrefs: PreferencesDocRaw = {
      tagCounts: { ...defaultTagCounts },
      updatedAt: Timestamp.now(),
    };
    await docRef.set(newPrefs);
    return { ...defaultTagCounts };
  }

  return data.tagCounts;
}

export async function incrementTag(
  userId: string,
  tag: TipTag,
): Promise<number> {
  const docRef = preferencesDocRef(userId);
  const snap = await docRef.get();

  let current: PreferencesDocRaw;

  if (!snap.exists || !snap.data()) {
    // Create default preferences if not exists
    current = {
      tagCounts: { ...defaultTagCounts },
      updatedAt: Timestamp.now(),
    };
  } else {
    current = snap.data()!;
  }

  // Increment the specific tag
  current.tagCounts[tag] = (current.tagCounts[tag] || 0) + 1;
  current.updatedAt = Timestamp.now();

  await docRef.set(current);

  return current.tagCounts[tag];
}
