// app/api/notify-all/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb.js";
import { UserDetail } from "@/models/songCache.js";
import { sendNotificationToTokens } from "@/lib/sendNotification";

export async function POST(req: Request) {
  const { title, body, url } = await req.json();

  if (!title || !body) {
    return NextResponse.json({ error: "Missing title or body" }, { status: 400 });
  }

  try {
    await connectDB();
    const users = await UserDetail.find({ notificationToken: { $exists: true, $ne: null } });

    const tokens = users.map((u: any) => u.notificationToken).filter(Boolean);

    console.log(`Sending notification to ${tokens.length} users...`);

    await sendNotificationToTokens(tokens, title, body);

    return NextResponse.json({ success: true, count: tokens.length });
  } catch (error) {
    console.error("Error broadcasting notifications:", error);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
