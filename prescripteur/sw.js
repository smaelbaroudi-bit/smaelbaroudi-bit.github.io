// Service worker généré par scripts/build-pwa.mjs — ne pas modifier à la main.
const CACHE = 'prescripteur-c4936f9cc372';
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","favicon-32.png","icon.svg"];

self.addEventListener('install', (event) => {
  // cache: 'reload' : ne jamais précharger une copie périmée du cache HTTP (GitHub Pages garde les fichiers 10 min).
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('prescripteur-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Réseau d'abord pour la page et le manifeste (nom et icône de l'application à jour), cache en secours hors-ligne ;
// cache d'abord pour les icônes.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate' || new URL(req.url).pathname.endsWith('.webmanifest')) {
    const key = req.mode === 'navigate' ? 'index.html' : 'manifest.webmanifest';
    event.respondWith(
      fetch(req)
        .then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); } return res; })
        .catch(() => caches.match(key)),
    );
    return;
  }
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
