import { AuthError, sendSignInLinkToEmail } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { getAppUrl } from '@/utils/platform';

interface UseSendEmailLinkProps {
  onError: (error: AuthError) => void;
  onEmailSent: (email: string) => void;
}

export const useSendEmailLink = ({
  onError,
  onEmailSent,
}: UseSendEmailLinkProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendEmailLink = async (email: string) => {
    setIsLoading(true);

    const actionCodeSettings = {
      url: getAppUrl() + window.location.pathname,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      onEmailSent(email);
    } catch (error) {
      onError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendEmailLink, isLoading };
};
