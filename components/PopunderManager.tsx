"use client";

import { useEffect } from "react";


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
      script.src = "//pl27533345.revenuecpmgate.com/8d/fe/75/8dfe75112dc3022bae089ecea2370b77.js"; // replace with your Adsterra code
      document.body.appendChild(script);

      localStorage.setItem("popunderLastShown", now.toString());
    }
  }, []);

  return null; // No UI
}
