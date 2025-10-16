// lib/sendNotification.ts
import axios from "axios";

const FCM_URL = "https://fcm.googleapis.com/fcm/send";

export async function sendNotificationToTokens(tokens: string[], title: string, body: string, url?: string) {
  if (!tokens || tokens.length === 0) return;

  const payload = {
    notification: {
      title,
      body,
      click_action: url, // optional: where to open when clicked
      icon: "/favicon.png",
    },
    registration_ids: tokens, // use registration_ids for multiple tokens
  };

  try {
    const response = await axios.post(FCM_URL, payload, {
      headers: {
        Authorization: `key=${process.env.FCM_SERVER_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("FCM Response:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("Error sending FCM notifications:", err.response?.data || err.message);
  }
}
