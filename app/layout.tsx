import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NotificationModal from "@/components/NotificationModal";
import { getOrCreateUserId } from "@/utils/generateUserId"; // adjust path if needed


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

getOrCreateUserId();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0049af" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
  
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationModal />
        {children}
      </body>
    </html>
  );
}
