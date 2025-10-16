"use client";
import { useState } from "react";

export default function NotifyAllButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/notify-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "🔥 Constellations by Jade LeMac",
        body: "Check out this song  on Tunebay.",
        url: "https://tunebay.vercel.app/music/Jade%20LeMac/song/Constellations", // optional
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) setMessage(`✅ Sent to ${data.count} users`);
    else setMessage(`❌ Failed: ${data.error || "Unknown error"}`);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-700/40"
      >
        {loading ? "Sending..." : "Send Notification"}
      </button>
      {message && <p className="text-sm text-gray-300">{message}</p>}
    </div>
  );
}
