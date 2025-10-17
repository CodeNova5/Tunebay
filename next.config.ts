// next.config.js
/** @type {import('next').NextConfig} */
const withPWA: any = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Allow Google One Tap popup to postMessage back to your origin
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          // Ensure embedder policy is not strict; use unsafe-none if you previously set COEP
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
        ],
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = withPWA({
  ...nextConfig,
  images: {
    domains: ["i.scdn.co"],
  },
});
