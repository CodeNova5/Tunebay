import mongoose from "mongoose";
import "dotenv/config";
import admin from "./firebaseAdmin.js";
import { UserDetail } from "./models/songCache.js"; // adjust path if needed

async function sendNotificationToAll(title, body, url) {
  try {
    // 1️⃣ Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        "mongodb+srv://Tuneflix:ZcjTP5jG4qyKkOZG@tuneflix.b1vcn.mongodb.net/?retryWrites=true&w=majority&appName=Tuneflix",
        { dbName: "cacheDB" }
      );
      console.log("✅ Connected to MongoDB for sending notifications.");
    }

    // 2️⃣ Get all users with valid FCM tokens
    const users = await UserDetail.find({
      notificationToken: { $exists: true, $ne: null },
    });

    if (users.length === 0) {
      console.log("⚠️ No users with notification tokens found.");
      return;
    }

    console.log(`📦 Found ${users.length} users. Sending notifications...`);

    // 3️⃣ Send notifications one by one so that fcm_options.link works
    for (const user of users) {
      const token = user.notificationToken;
      if (!token) continue;

      const message = {
        token,
        notification: {
          title,
          body,
        },
        webpush: {
          fcm_options: {
            link: url, // 🔗 the URL to open when notification is clicked
          },
        },
      };

      try {
        await admin.messaging().send(message);
        console.log(`✅ Notification sent to: ${token}`);
      } catch (err) {
        console.error(`❌ Failed to send to ${token}:`, err.message);

        // Optional cleanup for invalid tokens
        if (err.errorInfo?.code === "messaging/registration-token-not-registered") {
          await UserDetail.updateOne(
            { notificationToken: token },
            { $unset: { notificationToken: "" } }
          );
          console.log(`🗑 Removed invalid token: ${token}`);
        }
      }
    }

    console.log("🎉 All notifications sent!");
  } catch (error) {
    console.error("❌ Error sending notifications:", error);
  } finally {
    await mongoose.connection.close();
  }
}

// ✅ Example usage:
sendNotificationToAll(
  "🔥 New Music Alert!",
  "Check out the latest trending songs on Tunebay!",
  "https://tunebay.vercel.app/music/Ashley%20Kutcher/song/Love%20You%20From%20a%20Distance" // your actual app or landing page
);
