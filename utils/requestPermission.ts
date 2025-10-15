// utils/requestPermission.ts
import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

export async function requestNotificationPermission() {
  if (!messaging) return null;

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BEvnsPzvqGc4nrfwtMGILhEQzBNQ5zAtIn7gLQuT48Ix6RJdbWbisZYOz0AeRV7Wc0L6hsn0JlfAPUk63xyM_AA",
    });
    console.log("FCM Token:", token);
    return token;
  } else {
    console.warn("Notification permission not granted.");
    return null;
  }
}
