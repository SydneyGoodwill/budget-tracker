console.log("service worker working!");

const CACHE = "best-cache-ever";

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        '/',
        './styles.css',
        '/index.js',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
      ]);
    })
    .catch((err) => {
      console.error(err);
    })
  );
  event.skipWaiting();
});

self.addEventListener("activate", function(event) {
  console.log("Helloooo");
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE) {
            console.log("YOU HAVE BEEN DELETED", key);
            return caches.delete(key);
          }
        })
      );
    }))
})

self.addEventListener('fetch', function(event) {
  console.log('IT HAS HAPPENED', event);

  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request);
    })
  );
});