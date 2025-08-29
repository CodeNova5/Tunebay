"use client";

import { SMART_LINK } from "@/config";

export function useSmartRedirect() {
  function handleClick() {
    const visits = parseInt(localStorage.getItem("visits") || "0", 10) + 1;
    localStorage.setItem("visits", visits.toString());

    const lastRedirect = localStorage.getItem("lastRedirect");
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // Condition: at least 3 visits + 1 min since last redirect
    if (visits >= 3 && (!lastRedirect || now - parseInt(lastRedirect) > oneMinute)) {
      localStorage.setItem("lastRedirect", now.toString());
      window.location.href = SMART_LINK;
    } else {
      console.log("Redirect blocked: not enough visits or too soon.");
    }
  }

  return handleClick;
}
