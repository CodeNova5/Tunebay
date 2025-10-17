// Detect iOS — skip Firebase Messaging entirely
const isIOS = /iPad|iPhone|iPod/.test(self.navigator.userAgent);

if (!isIOS) {
  importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

  firebase.initializeApp({
    apiKey: "AIzaSyBi3udeo5_oURwg7hizNNQBN7tcZkkIP4s",
    authDomain: "hello-notif-b3353.firebaseapp.com",
    projectId: "hello-notif-b3353",
    messagingSenderId: "1000532897347",
    appId: "1:1000532897347:web:aca3d357144c038fa8aef6",
  });

  const messaging = firebase.messaging();

  // 🔹 Handle background notifications
  messaging.onBackgroundMessage((payload) => {
    console.log("📩 Background message received:", payload);

    const notificationTitle = payload.notification?.title || "Tunebay";
    const notificationOptions = {
      body: payload.notification?.body,
      image: payload.notification?.image,
      icon: "/favicon.png",
      data: payload, // keep the full payload for click handling
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  // 🔹 Handle clicks on notifications
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const url =
      event.notification?.data?.fcmOptions?.link ||
      event.notification?.data?.FCM_MSG?.notification?.click_action ||
      event.notification?.data?.click_action ||
      "https://tunebay.vercel.app/"; // fallback if missing

    console.log("🔗 Opening link:", url);

    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
    );
  });
} else {
  console.log("🚫 Firebase Messaging disabled on iOS — unsupported platform");
}