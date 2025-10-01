"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommentShareModule from "@/components/CommentShareModule";

interface tracks {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover_medium: string };
}

interface PlaylistDetails {
  name: string;
  image: string;
}

export default function PlaylistClientPage() {
  const { playlistId } = useParams() as { playlistId: string };
  const { playlistType } = useParams() as { playlistType: string };
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<tracks[]>([]);
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistDetails | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      try {
        const response = await fetch(
          `/api/Music/route?type=playlist&playlistId=${playlistId}&playlistType=${playlistType}`
        );
        if (!response.ok) throw new Error("Failed to fetch playlist tracks");
        const data = await response.json();

        if (data.tracks && Array.isArray(data.tracks)) {
          setTracks(
            data.tracks.map((track: any) => ({
              id: track.id,
              title: track.title,
              artist: { name: track.artist.name },
              album: { cover_medium: track.album.cover_medium },
            }))
          );
        } else {
          setTracks([]);
        }

        setPlaylistDetails({
          name: data.playlistDetails.name,
          image: data.playlistDetails.image,
        });
      } catch (err: any) {
        setError(err.message);
      }
    }

    if (playlistId && playlistType) {
      fetchTracks();
    } else {
      setError("Missing playlist ID or type");
    }
  }, [playlistId, playlistType]);

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((track) => (
        <Link
          key={track.id}
          href={`/music/${encodeURIComponent(track.artist.name)}/song/${encodeURIComponent(
            track.title
          )}`}
        >
          <div className="border rounded-lg p-2 shadow-md bg-gray-800 cursor-pointer flex flex-col items-center w-48">
            <img
              src={track.album.cover_medium}
              alt={track.title}
              className="w-48 h-48 object-cover rounded"
            />
            <h2
              className="font-semibold mt-2 text-center truncate w-full"
              title={track.title}
            >
              {track.title}
            </h2>
            <p
              className="text-gray-400 text-sm truncate w-full text-center"
              title={track.artist.name}
            >
              {track.artist.name}
            </p>
          </div>
        </Link>
      ))}
      <Footer />
    </div>
  );
}