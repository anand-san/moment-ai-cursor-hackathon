import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { AuthError } from 'firebase/auth';

const { mockFirebaseAuth } = vi.hoisted(() => {
  return {
    mockFirebaseAuth: {
      signInWithGoogle: vi.fn().mockResolvedValue({
        credential: { idToken: 'mock-google-id-token' },
      }),
    },
  };
});

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => true },
}));

vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: mockFirebaseAuth,
}));

import { useGoogleAuth } from '@/components/auth/hooks/useGoogleAuth';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

describe('useGoogleAuth - native', () => {
  const onError = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use native FirebaseAuthentication.signInWithGoogle on native', async () => {
    const { result } = renderHook(() => useGoogleAuth({ onError, onSuccess }));

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(mockFirebaseAuth.signInWithGoogle).toHaveBeenCalled();
    expect(GoogleAuthProvider.credential).toHaveBeenCalledWith(
      'mock-google-id-token',
    );
    expect(signInWithCredential).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when native sign-in fails', async () => {
    const mockError = new Error('Native sign-in failed') as AuthError;
    mockFirebaseAuth.signInWithGoogle.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGoogleAuth({ onError, onSuccess }));

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(onError).toHaveBeenCalledWith(mockError);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should manage loading state during native sign-in', async () => {
    let resolveSignIn: (value: unknown) => void;
    mockFirebaseAuth.signInWithGoogle.mockReturnValue(
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
      resolveSignIn!({
        credential: { idToken: 'mock-google-id-token' },
      });
      await signInPromise!;
    });

    expect(result.current.isLoading).toBe(false);
  });
});
