import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Tip } from '@sandilya-stack/shared/types';
import { Capacitor } from '@capacitor/core';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { runTipAction, triggerSwipeHaptic } from '@/lib/nativeTipActions';

const mockTip: Tip = {
  id: 'tip-1',
  title: 'Quick reset',
  description: 'Take a short break and reset.',
  tag: 'break',
  category: 'immediate',
  priority: 1,
  timeEstimate: '5 min',
  actionType: 'timer',
  swipeDirection: null,
};

describe('nativeTipActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    vi.mocked(LocalNotifications.checkPermissions).mockResolvedValue({
      display: 'granted',
    } as never);
    vi.mocked(LocalNotifications.requestPermissions).mockResolvedValue({
      display: 'granted',
    } as never);
  });

  it('schedules local notification for timer actions', async () => {
    const result = await runTipAction(mockTip);

    expect(LocalNotifications.schedule).toHaveBeenCalledOnce();
    expect(result.status).toBe('success');
  });

  it('returns error when notification permission is denied', async () => {
    vi.mocked(LocalNotifications.checkPermissions).mockResolvedValue({
      display: 'denied',
    } as never);
    vi.mocked(LocalNotifications.requestPermissions).mockResolvedValue({
      display: 'denied',
    } as never);

    const result = await runTipAction({ ...mockTip, actionType: 'reminder' });

    expect(LocalNotifications.schedule).not.toHaveBeenCalled();
    expect(result.status).toBe('error');
  });

  it('stores save actions in local storage', async () => {
    const result = await runTipAction({ ...mockTip, actionType: 'save' });
    const savedRaw = localStorage.getItem('momentai.savedTipActions');

    expect(result.status).toBe('success');
    expect(savedRaw).toBeTruthy();
    expect(savedRaw).toContain(mockTip.id);
  });

  it('triggers haptic feedback for swipe on native platform', async () => {
    await triggerSwipeHaptic('right');
    expect(Haptics.impact).toHaveBeenCalled();
  });

  it('skips haptic feedback on web', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    await triggerSwipeHaptic('left');
    expect(Haptics.impact).not.toHaveBeenCalled();
  });
});
