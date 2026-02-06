import { useEffect } from 'react';
import { isNative } from '@/utils/platform';

/**
 * On native, listens for deep link (App Link) opens and fires the callback
 * when the URL looks like a Firebase email sign-in link (contains `apiKey`).
 */
export function useDeepLinkAuth(onAuthLink: (url: string) => void) {
  useEffect(() => {
    if (!isNative) return;

    let handle: { remove: () => Promise<void> } | undefined;

    (async () => {
      const { App } = await import('@capacitor/app');
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
