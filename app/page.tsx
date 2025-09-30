import { Metadata } from "next";
import HomePage from "./HomePage"; // client component
import Script from "next/script";

export const metadata: Metadata = {
  title: 'Tunebay || Web Music Player',
  description: 'Get instant access to millions of songs, albums, and playlists. Discover new music, revisit old favorites, and let every moment have its perfect soundtrack — anytime, anywhere.',
  keywords: ['music', 'top songs', 'trending artists', 'genres', 'moods', 'anime songs', 'country songs', 'kids songs', 'Tunebay', 'Playlists'],
  authors: [{ name: 'Code Nova' }],
  openGraph: {
    title: 'Tunebay',
    description: 'Get access to millions of songs on Tunebay. Stream and discover the latest hits from your favorite artists.',
    url: 'https://tunebay.vercel.app',
    type: 'website',
    siteName: 'Tunebay',
    images: [
      {
        url: 'https://tunebay.vercel.app/images/og-image.jpg',
        height: 600,
        width: 1000,

        alt: 'Tunebay logo',
      },
    ],
    locale: 'en_US',
  },
};

export default function Page() {
  return (
    <>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4306931152368412"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <HomePage />
    </>
  );
}
