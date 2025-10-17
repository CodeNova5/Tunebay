// public/firebase-messaging-sw.js
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

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/favicon.png",
  });
});
