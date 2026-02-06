/**
 * Returns the app's public URL for use in redirects (e.g. email auth links).
 * Inside the Capacitor WebView, window.location.origin is https://localhost
 * which is unreachable outside the app — so we always use VITE_APP_URL.
 */
export function getAppUrl(): string {
  return import.meta.env.VITE_APP_URL ?? window.location.origin;
}
