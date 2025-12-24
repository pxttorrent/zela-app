self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Zela';
  const body = data.body || 'Lembrete';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon.png'
    })
  );
});
