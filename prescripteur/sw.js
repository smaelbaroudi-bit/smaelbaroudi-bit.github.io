// Service worker généré par scripts/build-pwa.mjs — ne pas modifier à la main.
const CACHE = 'prescripteur-ad8ee9670a12';
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","favicon-32.png","icon.svg"];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('prescripteur-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Réseau d'abord pour la page (récupère les mises à jour), cache en secours hors-ligne ;
// cache d'abord pour les icônes et le manifeste.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('index.html', copy)); return res; })
        .catch(() => caches.match('index.html')),
    );
    return;
  }
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
