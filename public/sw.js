const CACHE_NAME = "version-1";
const DYNAMIC_CACHE = "dynamic-cache-1";
const urlsToCache = ["/static/js/bundle.js", "/index.html", "/"];

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        //   return response || fetch(event.request);
        if (response) {
          return response;
        }
        let requestUrl = event.request.clone();
        return fetch(requestUrl).then((res) =>
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request.url, res.clone());
            return res;
          })
        );
      })
    );
  }
});

this.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
