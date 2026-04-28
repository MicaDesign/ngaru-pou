importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Values are injected at runtime via /api/messages/sw-config (see below).
// They can also be hard-coded here after you have your Firebase project config.
const config = self.__FIREBASE_CONFIG__ || {};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "Ngaru Pou";
  const body = payload.notification?.body ?? "You have a new message";
  self.registration.showNotification(title, {
    body,
    icon: "/images/main-logo-white.svg",
    badge: "/images/main-logo-white.svg",
    data: payload.data,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.link ?? "/messages";
  event.waitUntil(clients.openWindow(url));
});
