const CACHE_NAME = 'bibi-offline-cache-v1';

// List ALL files your app needs to run offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',               // Update with your actual CSS path
  '/index.js',                // Update with your actual JS path
  
  // Core Bibi assets (adjust paths based on your project structure)
  '/bibi/resources/scripts/bibi.js',
  '/bibi/resources/styles/bibi.css',
  
  // Your hardcoded EPUB books
  '/books/book1.epub',
  '/books/book2.epub'
];

// 1. Install Event: Cache all critical files immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching Bibi shell and books...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up old caches if you update your site
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Intercept network calls and serve from Cache first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached file if found; otherwise, try the network
      return cachedResponse || fetch(event.request);
    })
  );
});
