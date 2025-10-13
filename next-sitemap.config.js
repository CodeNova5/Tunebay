/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://tunebay.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  output: './public',
  sourceDir: 'app', // 👈 tell it your routes are in /app
};

export default config;
