import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useDeepLinkAuth } from '@/hooks/useDeepLinkAuth';

type UrlOpenCallback = (data: { url: string }) => void;

describe('useDeepLinkAuth', () => {
  let capturedCallback: UrlOpenCallback | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedCallback = null;
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    vi.mocked(App.getLaunchUrl).mockResolvedValue({ url: undefined } as never);
    vi.mocked(App.addListener).mockImplementation(
      (_event: string, cb: UrlOpenCallback) => {
        capturedCallback = cb;
        return Promise.resolve({ remove: vi.fn() }) as never;
      },
    );
  });

  it('should register appUrlOpen listener', async () => {
    const onAuthLink = vi.fn();
    renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(App.addListener).toHaveBeenCalledWith(
        'appUrlOpen',
        expect.any(Function),
      );
    });
  });

  it('should call onAuthLink when URL contains apiKey', async () => {
    const onAuthLink = vi.fn();
    renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(capturedCallback).toBeTruthy();
    });

    act(() => {
      capturedCallback!({
        url: 'https://momentai.sandilya.dev/?apiKey=abc123&oobCode=xyz',
      });
    });

    expect(onAuthLink).toHaveBeenCalledWith(
      'https://momentai.sandilya.dev/?apiKey=abc123&oobCode=xyz',
    );
  });

  it('should call onAuthLink when app is launched from an auth URL', async () => {
    const launchUrl = 'https://momentai.sandilya.dev/?apiKey=abc&oobCode=123';
    vi.mocked(App.getLaunchUrl).mockResolvedValue({ url: launchUrl } as never);
    const onAuthLink = vi.fn();
    renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(onAuthLink).toHaveBeenCalledWith(launchUrl);
    });
  });

  it('should not call onAuthLink when URL has no apiKey', async () => {
    const onAuthLink = vi.fn();
    renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(capturedCallback).toBeTruthy();
    });

    act(() => {
      capturedCallback!({ url: 'https://momentai.sandilya.dev/some-page' });
    });

    expect(onAuthLink).not.toHaveBeenCalled();
  });

  it('should clean up listener on unmount', async () => {
    const removeFn = vi.fn();
    vi.mocked(App.addListener).mockResolvedValue({
      remove: removeFn,
    } as never);

    const onAuthLink = vi.fn();
    const { unmount } = renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(App.addListener).toHaveBeenCalled();
    });

    unmount();

    expect(removeFn).toHaveBeenCalled();
  });

  it('should not register listeners on web', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    const onAuthLink = vi.fn();

    renderHook(() => useDeepLinkAuth(onAuthLink));

    await waitFor(() => {
      expect(Capacitor.isNativePlatform).toHaveBeenCalled();
    });

    expect(App.addListener).not.toHaveBeenCalled();
    expect(App.getLaunchUrl).not.toHaveBeenCalled();
  });
});
