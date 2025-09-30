import { Metadata } from "next";
import AlbumPage from "./AlbumPage";
import { SongCache } from "../../../../../models/songCache.js";
import { connectDB } from "../../../../../lib/mongodb.js";

// Server-side metadata generation
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = typeof props.params?.then === "function" ? await props.params : props.params;
  const { albumId } = params;

  const baseUrl = "https://tunebay.vercel.app";

  // Try MOngoDB cache
  await connectDB();
  const cacheKey = `album-${albumId}`;
  const mongoCache = await SongCache.findOne({ cacheKey });
  if (mongoCache) {
    console.log("✅ MongoDB cache hit for", cacheKey);
    const albumDetails = mongoCache.data;
    const title = `${albumDetails.name}`;
    const description = `Explore the album "${albumDetails.name}" featuring tracks, artist info, and more on Tunebay.`;
    const image = albumDetails.image;
    const url = `${baseUrl}/music/album/${encodeURIComponent(albumId)}`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: "music.album", // ✅ Correct Open Graph type
        siteName: "Tunebay",
        images: [
          {
            url: image,
            alt: `${albumDetails.name} cover art`,
          },
        ],
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      authors: [{ name: "Code Nova" }],
    };
  }
  console.log("❌ MongoDB cache miss for", cacheKey);
  
  // Fetch album details from your API route
  const apiUrl = `${baseUrl}/api/Music/route?type=albumDetail&albumId=${encodeURIComponent(albumId)}`;

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) {
    return {
      title: "Album Not Found | Tunebay",
      description: "Sorry, this album could not be found.",
    };
  }

  const albumDetails = await res.json();
  const title = `${albumDetails.name}`;
  const description = `Explore the album "${albumDetails.name}" featuring tracks, artist info, and more on Tunebay.`;
  const image = albumDetails.image;
  const url = `${baseUrl}/album/${encodeURIComponent(albumId)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "music.album", // ✅ Correct Open Graph type
      siteName: "Tunebay",
      images: [
        {
          url: image,
          alt: `${albumDetails.name} cover art`,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    authors: [{ name: "Code Nova" }],
  };
}

// ✅ Component must be outside metadata function
export default function Page() {
  return <AlbumPage />;
}