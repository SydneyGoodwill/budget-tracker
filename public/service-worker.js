console.log("service worker working!");

const CACHE = "best-cache-ever";
const DATA_CACHE = "data-cache";

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        './styles.css',
        'db.js',
        '/index.js',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
      ]);
    })
    .catch((err) => {
      console.error(err);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("activation working");
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE) {
              console.log("YOU HAVE BEEN DELETED", key);
              return caches.delete(key);
            }
          })
        );
      })
      .catch(error => console.log("activation error: ", error))
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  console.log('IT HAS HAPPENED', event);
  event.respondWith(
    fetch(event.request)
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
