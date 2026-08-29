const CACHE_NAME = 'jamalvfx-order-v4';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './admin.html',
  './admin.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './splash.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* network-first: همیشه اول از اینترنت نسخه‌ی تازه رو می‌گیره؛ فقط وقتی آفلاینه از کش استفاده می‌کنه */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
