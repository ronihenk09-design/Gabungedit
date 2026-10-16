// Ganti nama versi cache
const CACHE_NAME = 'gabungvideo-cache-v3';

// Daftar file yang disimpan agar web bisa dimuat sangat cepat & offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192-modern.png',
  './icon-512-modern.png'
];

// Daftar file yang disimpan agar web bisa dimuat sangat cepat & offline
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Proses Install & Simpan Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Proses Activate & Hapus Cache Lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Proses Fetch (Mengambil dari cache jika ada)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
      
