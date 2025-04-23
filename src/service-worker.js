/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'hangul-typer-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png', // Add if you create this size
  // Add paths to your JS and CSS bundles once you build the app
  // '/static/js/bundle.js',
  // '/static/js/main.chunk.js',
  // '/static/js/0.chunk.js', // Example chunk names
  // '/static/css/main.chunk.css',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // It's important to cache the main entry points
        // Add other critical assets like bundled JS/CSS if known
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(err => {
          console.error('Failed to open cache or cache files:', err);
      })
  );
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  return self.clients.claim(); // Take control of open clients immediately
});


self.addEventListener('fetch', event => {
  // Basic cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's also a stream.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(err => {
            console.error('Fetch failed; returning offline page instead.', err);
            // Optionally return a fallback offline page:
            // return caches.match('/offline.html');
        });
      })
    );
});
