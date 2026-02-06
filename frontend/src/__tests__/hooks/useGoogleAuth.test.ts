import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { AuthError } from 'firebase/auth';
import { useGoogleAuth } from '@/components/auth/hooks/useGoogleAuth';
import {
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

describe('useGoogleAuth', () => {
  const onError = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use native FirebaseAuthentication.signInWithGoogle', async () => {
    const { result } = renderHook(() => useGoogleAuth({ onError, onSuccess }));

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(FirebaseAuthentication.signInWithGoogle).toHaveBeenCalled();
    expect(GoogleAuthProvider.credential).toHaveBeenCalledWith(
      'mock-id-token',
    );
    expect(signInWithCredential).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when sign-in fails', async () => {
    const mockError = new Error('Sign-in failed') as AuthError;
    vi.mocked(FirebaseAuthentication.signInWithGoogle).mockRejectedValueOnce(
      mockError,
    );

    const { result } = renderHook(() => useGoogleAuth({ onError, onSuccess }));

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(onError).toHaveBeenCalledWith(mockError);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should manage loading state', async () => {
    let resolveSignIn: (value: unknown) => void;
    vi.mocked(FirebaseAuthentication.signInWithGoogle).mockReturnValue(
      new Promise(resolve => {
        resolveSignIn = resolve;
      }),
    );

    const { result } = renderHook(() => useGoogleAuth({ onError, onSuccess }));

    expect(result.current.isLoading).toBe(false);

    let signInPromise: Promise<void>;
    act(() => {
      signInPromise = result.current.handleGoogleSignIn();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveSignIn!({ credential: { idToken: 'mock-id-token' } });
      await signInPromise!;
    });

    expect(result.current.isLoading).toBe(false);
  });
});
