import { useEffect } from 'react';
import { App } from '@capacitor/app';

/**
 * Listens for deep link (App Link) opens and fires the callback
 * when the URL looks like a Firebase email sign-in link (contains `apiKey`).
 */
export function useDeepLinkAuth(onAuthLink: (url: string) => void) {
  useEffect(() => {
    let handle: { remove: () => Promise<void> } | undefined;

    (async () => {
      handle = await App.addListener('appUrlOpen', ({ url }) => {
        const params = new URLSearchParams(new URL(url).search);
        if (params.get('apiKey')) {
          onAuthLink(url);
        }
      });
    })();

    return () => {
      handle?.remove();
    };
  }, [onAuthLink]);
}
