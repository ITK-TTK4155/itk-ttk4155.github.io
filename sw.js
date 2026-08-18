const cacheName = self.location.pathname
const pages = [

  "/docs/section-1/",
    "/docs/section-1/section-2/",
    "/docs/section-1/section-2/leaf-page-1/",
    "/docs/section-1/section-2/leaf-page-2/",
    "/docs/section-1/section-3/",
    "/docs/section-1/section-3/leaf-page-1/",
    "/docs/section-1/section-3/leaf-page-2/",
    "/posts/blog-post-1/",
    "/tags/blog/",
    "/tags/post/",
    "/tags/",
    "/",
    "/docs/",
    "/posts/",
    "/book.min.7dca40f168e2fd532b7b1937df678e5fcb9289577e924bd85f799138b6137fa6.css",
  "/en.search-data.min.983c4d1b4c2a9b559d9f24800fad4e02fe86e076a104a23f114cf5c566332edc.json",
  "/en.search.min.e6e6eea28628f90f101149df0d57cd84330f9ece188a0e46e4db2b8885b1c461.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
