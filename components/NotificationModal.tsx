"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { requestNotificationPermission } from "@/utils/requestPermission";
import { Bell, X } from "lucide-react";

export default function NotificationModal() {
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    const token = await requestNotificationPermission();
    setLoading(false);

    if (token) {
      setGranted(true);
      setTimeout(() => setShow(false), 2000); // auto close after success
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
            {/* Close button */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 bg-green-500/10 border border-green-500/30 rounded-full p-3 w-fit"
            >
              <Bell className="text-green-500" size={36} />
            </motion.div>

            {/* Text */}
            <h2 className="text-xl font-semibold text-white mb-2">
              Stay in the Loop 🎵
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Enable notifications to get updates when new songs, albums, or artist drops hit Tunebay.
            </p>

            {/* Button */}
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
