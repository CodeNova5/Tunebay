// app/layout.tsx
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detect device using User-Agent
  const userAgent = (await headers()).get("user-agent")?.toLowerCase() || "";

  const isAndroid = userAgent.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isDesktop = !isAndroid && !isIOS;

  // Import NotificationModal only for Android or Desktop
  let NotificationModal = null;
  if (isAndroid || isDesktop) {
    const module = await import("@/components/NotificationModal");
    NotificationModal = module.default;
  }

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0049af" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {NotificationModal && <NotificationModal />}
        {children}
      </body>
    </html>
  );
}
