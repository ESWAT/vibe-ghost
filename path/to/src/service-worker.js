const CACHE = 'hangul-typer-cache';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log("Installing service worker");
      // Explicitly cache assets - IMPORTANT!
      cache.addAll([
        '/index.html',
        '/static/js/bundle.js', // Adjust if your bundle filename is different
        '/static/css/main.chunk.css', // Adjust if your main CSS filename is different
        '/static/js/main.chunk.js',  // Adjust if your main JS filename is different
        '/static/media/*.*' // Cache all media files (images, fonts, etc.)
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
