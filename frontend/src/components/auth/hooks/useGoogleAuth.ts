import {
  AuthError,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { useCallback, useState } from 'react';
import { auth } from '@/lib/firebase';

interface UseGoogleAuthProps {
  onError: (error: AuthError) => void;
  onSuccess: () => void;
}

export const useGoogleAuth = ({ onError, onSuccess }: UseGoogleAuthProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      const credential = GoogleAuthProvider.credential(
        result.credential?.idToken,
      );
      await signInWithCredential(auth, credential);
      onSuccess();
    } catch (error) {
      console.error('[GoogleAuth] sign-in failed:', error);
      onError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  }, [onError, onSuccess]);

  return { handleGoogleSignIn, isLoading };
};
