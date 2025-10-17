/** @type {import('next').NextConfig} */
const withPWA: any = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,

  // ✅ Add headers to fix Google login postMessage issue
  async headers() {
    return [
      {
        // Adjust path to match your actual login route
        source: '/login',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
    ];
  },

  images: {
    domains: ['i.scdn.co'],
  },
};

module.exports = withPWA(nextConfig);