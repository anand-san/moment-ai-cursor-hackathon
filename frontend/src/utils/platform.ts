import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();

/**
 * Returns the app's base URL.
 * On native (Capacitor), window.location.origin is https://localhost which is
 * unreachable outside the WebView — so we fall back to VITE_APP_URL.
 */
export function getAppUrl(): string {
  if (isNative) {
    return import.meta.env.VITE_APP_URL ?? window.location.origin;
  }
  return window.location.origin;
}
