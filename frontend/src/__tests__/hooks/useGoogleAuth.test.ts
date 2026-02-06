import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { AuthError } from 'firebase/auth';
import { useGoogleAuth } from '@/components/auth/hooks/useGoogleAuth';
import { signInWithPopup } from 'firebase/auth';

// Default setup.ts mocks @capacitor/core with isNativePlatform => false (web)

describe('useGoogleAuth - web', () => {
  const onError = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use signInWithPopup on web', async () => {
    const { result } = renderHook(() => useGoogleAuth({ onError, onSuccess }));

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(signInWithPopup).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when popup sign-in fails', async () => {
    const mockError = new Error('Popup closed') as AuthError;
    vi.mocked(signInWithPopup).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGoogleAuth({ onError, onSuccess }));

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(onError).toHaveBeenCalledWith(mockError);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should manage loading state', async () => {
    const { result } = renderHook(() => useGoogleAuth({ onError, onSuccess }));

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(result.current.isLoading).toBe(false);
  });
});
