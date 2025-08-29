"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RedirectModalProps {
  targetUrl: string;
  onClose: () => void;
}

export default function RedirectModal({ targetUrl, onClose }: RedirectModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = targetUrl; // redirect
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, targetUrl]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center">
        <h2 className="text-lg font-semibold mb-2">Redirecting...</h2>
        <p className="text-sm text-gray-600 mb-4">
          You are being redirected to an external site. This site is not part of ours.
        </p>

        <p className="text-gray-800 font-medium mb-4">
          Redirecting in <span className="font-bold">{countdown}</span> seconds...
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => (window.location.href = targetUrl)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Continue Now
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
