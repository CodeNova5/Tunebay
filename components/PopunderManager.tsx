"use client";

import { useEffect } from "react";
import { SMART_LINK } from "@/config";

export default function PopunderManager() {
  useEffect(() => {
    const visits = parseInt(localStorage.getItem("visits") || "0", 10) + 1;
    localStorage.setItem("visits", visits.toString());

    const lastShown = localStorage.getItem("popunderLastShown");
    const now = Date.now();

    // 2 minutes = 120,000 ms
    const interval = 2 * 60 * 1000;

    if (visits >= 5 && (!lastShown || now - parseInt(lastShown) > interval)) {
      // Inject Adsterra popunder script
      const script = document.createElement("script");
      script.src = SMART_LINK; // replace with your Adsterra code
      document.body.appendChild(script);

      localStorage.setItem("popunderLastShown", now.toString());
    }
  }, []);

  return null; // No UI
}
