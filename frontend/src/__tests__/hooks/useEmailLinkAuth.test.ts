import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { AuthError } from 'firebase/auth';
import { useEmailLinkAuth } from '@/components/auth/hooks/useEmailLinkAuth';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

describe('useEmailLinkAuth', () => {
  const onError = vi.fn();
  const onSuccess = vi.fn();
  const onEmailRequired = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('should not trigger sign-in when URL is not an email link', async () => {
    vi.mocked(isSignInWithEmailLink).mockReturnValue(false);

    const { result } = renderHook(() =>
      useEmailLinkAuth({ onError, onSuccess, onEmailRequired }),
    );

    await act(async () => {
      await result.current.handleEmailLink();
    });

    expect(signInWithEmailLink).not.toHaveBeenCalled();
  });

  it('should request email when no stored email is found', async () => {
    vi.mocked(isSignInWithEmailLink).mockReturnValue(true);

    const { result } = renderHook(() =>
      useEmailLinkAuth({ onError, onSuccess, onEmailRequired }),
    );

    await act(async () => {
      await result.current.handleEmailLink();
    });

    expect(onEmailRequired).toHaveBeenCalled();
    expect(result.current.needsEmailConfirmation).toBe(true);
  });

  it('should complete sign-in when stored email exists', async () => {
    vi.mocked(isSignInWithEmailLink).mockReturnValue(true);
    vi.mocked(signInWithEmailLink).mockResolvedValue({
      user: { displayName: 'Test' },
    } as never);
    window.localStorage.setItem('emailForSignIn', 'test@example.com');

    const { result } = renderHook(() =>
      useEmailLinkAuth({ onError, onSuccess, onEmailRequired }),
    );

    await act(async () => {
      await result.current.handleEmailLink();
    });

    expect(signInWithEmailLink).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  describe('handleEmailLinkFromUrl', () => {
    it('should complete sign-in using the provided URL', async () => {
      vi.mocked(isSignInWithEmailLink).mockReturnValue(true);
      vi.mocked(signInWithEmailLink).mockResolvedValue({
        user: { displayName: 'Test' },
      } as never);
      window.localStorage.setItem('emailForSignIn', 'test@example.com');

      const { result } = renderHook(() =>
        useEmailLinkAuth({ onError, onSuccess, onEmailRequired }),
      );

      await act(async () => {
        await result.current.handleEmailLinkFromUrl(
          'https://momentai.sandilya.dev/?apiKey=abc&oobCode=xyz',
        );
      });

      expect(isSignInWithEmailLink).toHaveBeenCalledWith(
        expect.anything(),
        'https://momentai.sandilya.dev/?apiKey=abc&oobCode=xyz',
      );
      expect(signInWithEmailLink).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should request email when none is stored for deep-linked URL', async () => {
      vi.mocked(isSignInWithEmailLink).mockReturnValue(true);

      const { result } = renderHook(() =>
        useEmailLinkAuth({ onError, onSuccess, onEmailRequired }),
      );

      await act(async () => {
        await result.current.handleEmailLinkFromUrl(
          'https://momentai.sandilya.dev/?apiKey=abc&oobCode=xyz',
        );
      });

      expect(onEmailRequired).toHaveBeenCalled();
      expect(result.current.needsEmailConfirmation).toBe(true);
    });

    it('should not attempt sign-in when URL is not a valid email link', async () => {
      vi.mocked(isSignInWithEmailLink).mockReturnValue(false);

      const { result } = renderHook(() =>
        useEmailLinkAuth({ onError, onSuccess, onEmailRequired }),
      );

      await act(async () => {
        await result.current.handleEmailLinkFromUrl(
          'https://momentai.sandilya.dev/some-page',
        );
      });

      expect(signInWithEmailLink).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
