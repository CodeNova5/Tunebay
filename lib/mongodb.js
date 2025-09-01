import mongoose from "mongoose";

let isConnected = false; // prevent multiple connections in dev

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "cacheDB", // your DB name
    });

    isConnected = true;
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
