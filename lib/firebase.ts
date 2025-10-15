// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBi3udeo5_oURwg7hizNNQBN7tcZkkIP4s",
  authDomain: "hello-notif-b3353.firebaseapp.com",
  projectId: "hello-notif-b3353",
  storageBucket: "hello-notif-b3353.firebasestorage.app",
  messagingSenderId: "1000532897347",
  appId: "1:1000532897347:web:aca3d357144c038fa8aef6",
  measurementId: "G-5M6JBZFZ4K"
};


const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;