const CACHE_NAME = "KakuroTime-v7.0";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// インストール
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// fetch
self.addEventListener("fetch", event => {

  // ★ ここが最重要
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html")
        .then(response => {
          return response || fetch(event.request);
        })
    );
    return;
  }

  // 通常リソース
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});