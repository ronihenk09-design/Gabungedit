const CACHE_NAME = 'gabungvideo-v6';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon-192.png',
  '/favicon-512.png',
  '/favicon-48.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Jangan cache iklan & analytics
  if (url.includes('highperformanceformat.com') || url.includes('adsterra') || url.includes('googlesyndication') || url.includes('google-analytics')) {
    return;
  }
  // Manifest & icon selalu ambil yang baru
  if (url.includes('manifest.json') || url.includes('favicon-')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
