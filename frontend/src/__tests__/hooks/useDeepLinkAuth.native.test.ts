import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

type UrlOpenCallback = (data: { url: string }) => void;

const { mockApp } = vi.hoisted(() => {
  let listener: UrlOpenCallback | null = null;
  const app = {
    addListener: vi.fn((_event: string, cb: UrlOpenCallback) => {
      listener = cb;
      return Promise.resolve({ remove: vi.fn() });
    }),
    getListener: () => listener,
  };
  return { mockApp: app };
});

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => true },
}));

vi.mock('@capacitor/app', () => ({
  App: mockApp,
}));

import { useDeepLinkAuth } from '@/hooks/useDeepLinkAuth';

describe('useDeepLinkAuth - native', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register appUrlOpen listener on native', async () => {
    const onAuthLink = vi.fn();
    renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(mockApp.addListener).toHaveBeenCalledWith(
        'appUrlOpen',
        expect.any(Function),
      );
    });
  });

  it('should call onAuthLink when URL contains apiKey', async () => {
    const onAuthLink = vi.fn();
    renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(mockApp.getListener()).toBeTruthy();
    });

    const listener = mockApp.getListener()!;
    act(() => {
      listener({
        url: 'https://momentai.sandilya.dev/?apiKey=abc123&oobCode=xyz',
      });
    });

    expect(onAuthLink).toHaveBeenCalledWith(
      'https://momentai.sandilya.dev/?apiKey=abc123&oobCode=xyz',
    );
  });

  it('should not call onAuthLink when URL has no apiKey', async () => {
    const onAuthLink = vi.fn();
    renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(mockApp.getListener()).toBeTruthy();
    });

    const listener = mockApp.getListener()!;
    act(() => {
      listener({ url: 'https://momentai.sandilya.dev/some-page' });
    });

    expect(onAuthLink).not.toHaveBeenCalled();
  });

  it('should clean up listener on unmount', async () => {
    const removeFn = vi.fn();
    mockApp.addListener.mockResolvedValue({ remove: removeFn });

    const onAuthLink = vi.fn();
    const { unmount } = renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(mockApp.addListener).toHaveBeenCalled();
    });

    unmount();

    expect(removeFn).toHaveBeenCalled();
  });
});
