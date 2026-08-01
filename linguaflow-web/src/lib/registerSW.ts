// Registers the service worker at the root scope so the app is installable and can
// launch standalone. Kept intentionally minimal; failures are non-fatal (the app
// works fine without it).
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline support is best-effort; ignore registration errors */
    });
  });
}
