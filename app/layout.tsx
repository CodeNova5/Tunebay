import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { requestNotificationPermission } from "@/utils/requestPermission";
import { useEffect } from "react";


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

  useEffect(() => {
  requestNotificationPermission()
      .then((token) => {
        if (token) console.log("Notification token:", token);
      })
      .catch(console.error);
}, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2364ddff" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
  
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
