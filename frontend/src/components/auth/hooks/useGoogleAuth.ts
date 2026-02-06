import {
  AuthError,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from 'firebase/auth';
import { useCallback, useState } from 'react';
import { auth } from '@/lib/firebase';
import { isNative } from '@/utils/platform';

interface UseGoogleAuthProps {
  onError: (error: AuthError) => void;
  onSuccess: () => void;
}

export const useGoogleAuth = ({ onError, onSuccess }: UseGoogleAuthProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);

    try {
      if (isNative) {
        const { FirebaseAuthentication } = await import(
          '@capacitor-firebase/authentication'
        );
        const result = await FirebaseAuthentication.signInWithGoogle();
        const credential = GoogleAuthProvider.credential(
          result.credential?.idToken,
        );
        await signInWithCredential(auth, credential);
      } else {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
      onSuccess();
    } catch (error) {
      onError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  }, [onError, onSuccess]);

  return { handleGoogleSignIn, isLoading };
};
