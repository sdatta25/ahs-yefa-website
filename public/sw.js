// Minimal service worker so browsers offer "Install app". It caches nothing:
// every request goes to the network, so the app always shows the latest site.
self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()))
self.addEventListener("fetch", () => {})
