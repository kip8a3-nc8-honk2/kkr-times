const CACHE_NAME = "KakuroTime-v8.21";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// 1. インストール（初回読み込み時にファイルをキャッシュに保存）
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  // 新しいService Workerを待機させず、すぐに有効化する
  self.skipWaiting();
});

// 2. アクティベート（古いバージョンのキャッシュ「v8.7」などを自動削除して整理）
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  // すべてのタブやホーム画面アプリにこの新しい挙動を即座に適用する
  self.clients.claim();
});

// 3. フェッチ処理（機内モードでも確実にキャッシュを返す最重要パート）
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュにデータ（index.html等）があれば、通信状態に関わらず即座にそれを返す
      if (response) {
        return response;
      }
      // 万が一キャッシュにないリソース（追加した画像など）があれば、ネットに読みに行く
      return fetch(event.request);
    })
  );
});