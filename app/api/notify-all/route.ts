import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect.js";
import { UserDetail } from "@/models/songCache.js";
import admin from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { title, body, url } = await req.json();
    await connectDB();

    const users = await UserDetail.find({
      notificationToken: { $exists: true, $ne: null },
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No users with tokens found" });
    }

    const tokens = users.map((u) => u.notificationToken);

    const payload = {
      notification: { title, body, url, icon: "/favicon.png" },
    };

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: payload.notification,
    });

    return NextResponse.json({
      message: "Notifications sent successfully",
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
