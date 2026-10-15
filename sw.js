// File Service Worker minimal untuk memicu PWA Install
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Terinstal');
    self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
    // Wajib ada event fetch agar Chrome mengenali ini sebagai PWA yang bisa diinstal
});
