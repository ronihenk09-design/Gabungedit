const CACHE_NAME = 'gabungvideo-v4';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-512x512.png'
];

// Install - cache core aja
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - hapus cache lama v1,v2,v3 biar icon hati hilang!
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - PINTAR: Jangan cache iklan & manifest pakai network-first
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 1. JANGAN CACHE IKLAN ADSTERRA & ANALYTICS (biar cuan jalan)
  if (
    url.includes('highperformanceformat.com') ||
    url.includes('adsterra') ||
    url.includes('googlesyndication') ||
    url.includes('google-analytics')
  ) {
    return; // biarkan lewat tanpa di-cache
  }

  // 2. Untuk manifest & icon: NETWORK FIRST (biar icon baru langsung kelihatan)
  if (url.includes('manifest.json') || url.includes('icon-')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Untuk file lain: CACHE FIRST (biar cepat)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
