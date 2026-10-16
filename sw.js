const CACHE_NAME = 'gabungvideo-v2';
const urlsToCache = ['./', './index.html', './manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  // JANGAN CACHE IKLAN!
  if (url.includes('profitableratecpmnetwork') || url.includes('adsterra') || url.includes('cpm')) {
    return;
  }
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});
