import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDeepLinkAuth } from '@/hooks/useDeepLinkAuth';

// Default setup.ts mocks @capacitor/core with isNativePlatform => false
// and @capacitor/app with App.addListener mock

describe('useDeepLinkAuth - web', () => {
  it('should not register any listener on web', () => {
    const onAuthLink = vi.fn();
    renderHook(() => useDeepLinkAuth(onAuthLink));

    // On web, the hook should be a no-op
    expect(onAuthLink).not.toHaveBeenCalled();
  });
});
