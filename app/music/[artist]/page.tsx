import { Metadata } from "next";
import ArtistPage from "./ArtistPage";
import { SongCache } from "../../../models/songCache.js"; 
import { connectDB } from "../../../lib/mongodb.js";
// Server-side metadata generation
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = typeof props.params?.then === "function" ? await props.params : props.params;
  const { artist } = params;

  const baseUrl = "https://tunebay.vercel.app";

  // Try MOngoDB cache
  await connectDB();
  const cacheKey = `artist-${decodeURIComponent(artist)}`;
  const mongoCache = await SongCache.findOne({ cacheKey });
  if (mongoCache) {
    console.log("✅ MongoDB cache hit for", cacheKey);
    const artistDetails = mongoCache.data;
    const title = `${artistDetails.name}`;
    const description = `Check out this artist "${artistDetails.name}". View songs, albums, and more on Tunebay.`;
    const image = artistDetails.image;
    const url = `${baseUrl}/music/${encodeURIComponent(artist)}`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: "profile",
        siteName: "Tunebay",
        images: [
          {
            url: image,
            alt: `${artistDetails.name} album cover`,
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
  
  // Fetch artist details from your API route
  const apiUrl = `${baseUrl}/api/Music/route?type=artistDetails&artistName=${encodeURIComponent(artist)}`;

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) {
    return {
      title: "Song Not Found | Tunebay",
      description: "Sorry, this song could not be found.",
    };
  }

  const artistDetails = await res.json();
  const title = `${artistDetails.name}`;
  const description = `Check out this artist "${artistDetails.name}". View songs, albums, and more on Tunebay.`;
  const image = artistDetails.image;
  const url = `${baseUrl}/music/${encodeURIComponent(artist)}`;

  // store in MongoDB cache for next time
  await SongCache.findOneAndUpdate(
    { cacheKey },
    { data: artistDetails, createdAt: new Date() },
    { upsert: true, new: true }
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      siteName: "Tunebay",
      images: [
        {
          url: image,
          alt: `${artistDetails.name} album cover`,
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

// ✅ This MUST be outside the function, at the top level
export default function Page() {
  return <ArtistPage />;
}