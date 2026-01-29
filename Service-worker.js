/* ========= Service Worker - Safe Update Version ========= */

/** 👉 每次网站更新，只需要改这个版本号 **/
const CACHE_VERSION = 'v20260128';
const CACHE_NAME = `npn-cache-${CACHE_VERSION}`;

/** 👉 需要缓存的核心文件（尽量少） **/
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/layout-config.css',
  '/config-sound.js',
  '/manifest.json'
];

/* ========== 安装阶段：缓存核心文件 ========== */
self.addEventListener('install', event => {
  self.skipWaiting(); // 立即激活新版本
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

/* ========== 激活阶段：清理旧缓存 ========== */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // 立刻接管页面
})

/* ========== 请求策略 ========== */
self.addEventListener('fetch', event => {
  const req = event.request;

  // ❌ 不缓存 HTML（确保页面永远是最新）
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(fetch(req));
    return;
  }

  // ✅ 其它资源：缓存优先 + 后台更新
  event.respondWith(
    caches.match(req).then(cacheRes => {
      return (
        cacheRes ||
        fetch(req).then(networkRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        })
      );
    })
  );
});
