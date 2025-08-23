"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [googleClientId, setGoogleClientId] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
      fetch('/api/Music/route?type=clientId')
        .then(res => res.json())
        .then(data => setGoogleClientId(data.clientId));
    }, []);

  React.useEffect(() => {
    // Only show One Tap if user is not logged in
    if (typeof window === "undefined") return;
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) return;

    // Add Google script
    const googleScript = document.createElement('script');
    googleScript.src = 'https://accounts.google.com/gsi/client';
    googleScript.async = true;
    googleScript.defer = true;
    document.body.appendChild(googleScript);

    googleScript.onload = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId, // <-- replace with your client ID or fetch dynamically
          callback: handleCredentialResponse,
          cancel_on_tap_outside: false,
        });
        window.google.accounts.id.prompt();
      }
    };

    function handleCredentialResponse(response: any) {
      if (response.credential) {
        const data = parseJwt(response.credential);
        localStorage.setItem('userInfo', JSON.stringify({
          data,
          provider: "google"
        }));
        window.location.reload(); // reload to update UI
      }
    }

    function parseJwt(token: string) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    }

    // Cleanup
    return () => {
      document.body.removeChild(googleScript);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
