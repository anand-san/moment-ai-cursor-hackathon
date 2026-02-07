import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Listens for deep link (App Link) opens and fires the callback
 * when the URL looks like a Firebase email sign-in link (contains `apiKey`).
 */
export function useDeepLinkAuth(onAuthLink: (url: string) => void) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let handle: { remove: () => Promise<void> } | undefined;

    const handlePotentialAuthUrl = (url?: string) => {
      if (!url) {
        return;
      }

      try {
        const params = new URL(url).searchParams;
        if (params.get('apiKey') && params.get('oobCode')) {
          onAuthLink(url);
        }
      } catch {
        // Ignore malformed links.
      }
    };

    (async () => {
      try {
        const launchUrl = await App.getLaunchUrl();
        handlePotentialAuthUrl(launchUrl?.url);

        handle = await App.addListener('appUrlOpen', ({ url }) => {
          handlePotentialAuthUrl(url);
        });
      } catch {
        // Ignore native listener setup failures.
      }
    })();

    return () => {
      void handle?.remove();
    };
  }, [onAuthLink]);
}
