import type { Tip } from '@sandilya-stack/shared/types';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

const SAVED_TIPS_KEY = 'momentai.savedTipActions';
const MAX_ANDROID_NOTIFICATION_ID = 2147483647;

type TipActionStatus = 'success' | 'error' | 'info';

export interface TipActionResult {
  status: TipActionStatus;
  title: string;
  description: string;
}

interface SavedTipAction {
  id: string;
  title: string;
  description: string;
  savedAt: string;
}

let notificationSeed = Date.now() % MAX_ANDROID_NOTIFICATION_ID;

function nextNotificationId() {
  notificationSeed += 1;
  if (notificationSeed >= MAX_ANDROID_NOTIFICATION_ID) {
    notificationSeed = 1;
  }
  return notificationSeed;
}

function parseDurationToSeconds(timeEstimate: string | undefined, fallback: number) {
  if (!timeEstimate) {
    return fallback;
  }

  const match = timeEstimate
    .toLowerCase()
    .match(/(\d+)\s*(hour|hr|h|minute|min|m|second|sec|s)?/);

  if (!match) {
    return fallback;
  }

  const value = Number.parseInt(match[1], 10);
  const unit = match[2] ?? 'min';

  if (unit.startsWith('h')) {
    return value * 60 * 60;
  }

  if (unit.startsWith('s')) {
    return value;
  }

  return value * 60;
}

async function ensureNotificationPermission() {
  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') {
    return true;
  }

  const requested = await LocalNotifications.requestPermissions();
  return requested.display === 'granted';
}

async function scheduleNotification(
  title: string,
  body: string,
  delaySeconds: number,
) {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: nextNotificationId(),
        title,
        body,
        schedule: {
          at: new Date(Date.now() + delaySeconds * 1000),
          allowWhileIdle: true,
        },
      },
    ],
  });
}

function upsertSavedTip(tip: Tip) {
  const currentRaw = localStorage.getItem(SAVED_TIPS_KEY);
  const saved: SavedTipAction[] = currentRaw ? JSON.parse(currentRaw) : [];

  if (saved.some(item => item.id === tip.id)) {
    return false;
  }

  saved.push({
    id: tip.id,
    title: tip.title,
    description: tip.description,
    savedAt: new Date().toISOString(),
  });

  localStorage.setItem(SAVED_TIPS_KEY, JSON.stringify(saved));
  return true;
}

async function openSmsComposer(tip: Tip) {
  const body = encodeURIComponent(`${tip.title}\n\n${tip.description}`);
  const separator = Capacitor.getPlatform() === 'ios' ? '&' : '?';
  window.location.href = `sms:${separator}body=${body}`;
}

export async function triggerSwipeHaptic(direction: 'left' | 'right') {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await Haptics.impact({
      style: direction === 'right' ? ImpactStyle.Medium : ImpactStyle.Light,
    });
  } catch {
    // Ignore haptic failures; swipe should still work.
  }
}

export async function runTipAction(tip: Tip): Promise<TipActionResult> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  } catch {
    // Ignore haptic failures and continue with action.
  }

  try {
    switch (tip.actionType) {
      case 'timer': {
        const seconds = parseDurationToSeconds(tip.timeEstimate, 5 * 60);
        const hasPermission = await ensureNotificationPermission();
        if (!hasPermission) {
          return {
            status: 'error',
            title: 'Notifications disabled',
            description:
              'Enable notifications to run timers and reminders from tips.',
          };
        }

        await scheduleNotification(
          'Timer complete',
          `${tip.title} is done. Great job following through.`,
          seconds,
        );
        return {
          status: 'success',
          title: 'Timer started',
          description: `I will notify you in ${tip.timeEstimate || 'a few minutes'}.`,
        };
      }

      case 'reminder': {
        const seconds = parseDurationToSeconds(tip.timeEstimate, 60 * 60);
        const hasPermission = await ensureNotificationPermission();
        if (!hasPermission) {
          return {
            status: 'error',
            title: 'Notifications disabled',
            description:
              'Enable notifications to schedule reminders from tips.',
          };
        }

        await scheduleNotification(
          'Friendly reminder',
          `${tip.title}: ${tip.description}`,
          seconds,
        );
        return {
          status: 'success',
          title: 'Reminder scheduled',
          description: `You will get a reminder in ${tip.timeEstimate || 'about an hour'}.`,
        };
      }

      case 'message': {
        await openSmsComposer(tip);
        return {
          status: 'info',
          title: 'Message ready',
          description: 'Opened your messaging app with the tip pre-filled.',
        };
      }

      case 'save': {
        const wasNewSave = upsertSavedTip(tip);
        return {
          status: 'success',
          title: wasNewSave ? 'Tip saved' : 'Already saved',
          description: wasNewSave
            ? 'Saved locally for quick access later.'
            : 'This tip is already in your saved list.',
        };
      }

      case 'none':
      default:
        return {
          status: 'info',
          title: 'No action available',
          description: 'This tip does not include a quick action.',
        };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to run this tip action.';

    return {
      status: 'error',
      title: 'Action failed',
      description: message,
    };
  }
}
