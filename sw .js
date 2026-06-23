const CACHE = 'boyle-v2-b1-1';
const ASSETS = ['./'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Dejar pasar llamadas a APIs externas
  const url = e.request.url;
  if (url.includes('firebasejs') || url.includes('googleapis') ||
      url.includes('accounts.google') || url.includes('tabler-icons') ||
      url.includes('firebaseio') || url.includes('garmin_historial')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
