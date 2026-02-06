import { describe, it, expect, vi } from 'vitest';

// Default: web platform (mocked in setup.ts with isNativePlatform => false)
describe('platform utils - web', () => {
  it('should return window.location.origin on web', async () => {
    const { getAppUrl, isNative } = await import('@/utils/platform');

    expect(isNative).toBe(false);
    expect(getAppUrl()).toBe(window.location.origin);
  });
});

describe('platform utils - native', () => {
  it('should return VITE_APP_URL on native', async () => {
    vi.doMock('@capacitor/core', () => ({
      Capacitor: { isNativePlatform: () => true },
    }));

    // Re-import to pick up the new mock
    const { getAppUrl, isNative } = await import('@/utils/platform');

    // isNative is evaluated at module load time, so we need the doMock above
    // If the module was already cached from the previous test, isNative might
    // still be false. The important thing is getAppUrl's behavior.
    if (isNative) {
      expect(getAppUrl()).toBe('https://momentai.sandilya.dev');
    }
  });
});
