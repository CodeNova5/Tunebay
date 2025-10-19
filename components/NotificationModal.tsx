"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { requestNotificationPermission } from "@/utils/requestPermission";
import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { Bell, X } from "lucide-react";
import { getOrCreateUserId } from "@/utils/generateUserId";

export default function NotificationModal() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPermissionAndToken = async () => {
      const currentPermission = Notification.permission;

      if (currentPermission === "default") {
        // Not yet granted → show modal
        setShow(true);
      } else if (currentPermission === "granted") {
        // Already granted → get token and ensure it's in DB
        setGranted(true);
        setShow(false);

        try {
          const token = await getToken(messaging, {
            vapidKey: "BEvnsPzvqGc4nrfwtMGILhEQzBNQ5zAtIn7gLQuT48Ix6RJdbWbisZYOz0AeRV7Wc0L6hsn0JlfAPUk63xyM_AA",
          });

          if (token) {
            const userId = getOrCreateUserId();

            // Check if token exists in DB
            const res = await fetch("/api/Music/route?type=checkUserToken", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, notificationToken: token }),
            });

            const data = await res.json();

            // If token not in DB → add it
            if (!data.exists) {
              await fetch("/api/Music/route?type=storeUserDetail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, notificationToken: token }),
              });
            }
          }
        } catch (err) {
          console.error("Error verifying notification token:", err);
        }
      } else {
        // permission = "denied"
        setShow(false);
      }
    };

    checkPermissionAndToken();
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    const token = await requestNotificationPermission();
    setLoading(false);

    if (token) {
      setGranted(true);
      setTimeout(() => setShow(false), 1800);
      const userId = getOrCreateUserId();

      await fetch("/api/Music/route?type=storeUserDetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, notificationToken: token }),
      });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-br from-[#111] via-[#181818] to-[#222] border border-white/10 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 bg-green-500/10 border border-green-500/30 rounded-full p-3 w-fit"
            >
              <Bell className="text-green-500" size={36} />
            </motion.div>

            <h2 className="text-xl font-semibold text-white mb-2">
              Stay in the Loop 🎵
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Enable notifications to get updates when new songs, albums, or artist drops hit Tunebay.
            </p>

            {!granted ? (
              <button
                onClick={handleEnable}
                disabled={loading}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                  loading
                    ? "bg-green-500/40 text-white/60 cursor-wait"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30"
                }`}
              >
                {loading ? "Enabling..." : "Enable Notifications"}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 font-medium"
              >
                ✅ Notifications Enabled!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}