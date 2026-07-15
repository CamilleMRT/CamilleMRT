// Carnet d'enquête — service worker.
// Offline-first shell caching + Web Push display. The .ics reminders remain the
// reliable floor; this SW only adds the contextual push comfort layer.

const CACHE = "carnet-v1";
const APP_SHELL = ["/", "/escalier", "/bilan", "/analyse", "/reglages", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL).catch(() => {})),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

// Network-first for navigations (fresh when online, cached when offline),
// cache-first for other GETs.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return; // never cache API

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/"))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        }),
    ),
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "Carnet d'enquête", body: "" };
  try {
    if (event.data) data = event.data.json();
  } catch {
    if (event.data) data = { title: "Carnet d'enquête", body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Carnet d'enquête", {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "carnet",
      renotify: true,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const c of clients) if ("focus" in c) return c.focus();
      return self.clients.openWindow("/");
    }),
  );
});
