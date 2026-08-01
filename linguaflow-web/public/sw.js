/* LinguaFlow service worker — dependency-free, dev- and prod-safe.
 *
 * Strategy:
 *  - Never touch non-GET requests or cross-origin requests (the API on :5215 is
 *    always hit live, never cached).
 *  - Navigations: network-first, falling back to the cached app shell so the app
 *    still opens offline (SPA -> index.html).
 *  - Other same-origin GETs (JS/CSS/icons): network-first, cache fallback.
 *
 * Network-first keeps things fresh in `npm run dev` (online == always latest, so
 * HMR is unaffected) while still enabling offline launch once assets are cached.
 */
const CACHE = 'linguaflow-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/pwa-192.png',
  '/icons/pwa-512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL).catch(() => {})),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

function cachePut(request, response) {
  if (response && response.ok && response.type === 'basic') {
    caches.open(CACHE).then((cache) => cache.put(request, response));
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle our own origin, GET only. The API and any cross-origin call pass through.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          cachePut(request, res.clone());
          return res;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match('/index.html'))),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((res) => {
        cachePut(request, res.clone());
        return res;
      })
      .catch(() => caches.match(request)),
  );
});
