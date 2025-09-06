"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CommentShareModule from "@/components/CommentShareModule";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Track {
  name: string;
  albumImage: string;
  artists: { name: string, id: string }[];
}

export default function ArtistPage() {
  const { artist } = useParams() as { artist: string };
  const [artistDetails, setArtistDetails] = React.useState<any | null>(null);
  const [topTracks, setTopTracks] = React.useState<Track[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [relatedArtists, setRelatedArtists] = React.useState<any[]>([]);
  const [artistAlbums, setArtistAlbums] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (artist) {
      async function fetchArtistData() {
        try {
          // Fetch artist details
          const artistResponse = await fetch(
            `/api/Music/route?type=artistDetails&artistName=${encodeURIComponent(artist)}`
          );
          if (!artistResponse.ok) {
            const errorData = await artistResponse.json();
            setError(errorData.error || "Failed to fetch artist details");
            return;
          }
          const artistData = await artistResponse.json();
          setArtistDetails(artistData);

           // Fetch top tracks
          const tracksResponse = await fetch(
            `/api/Music/route?type=artistSongs&artistName=${encodeURIComponent(artist)}`
          );
          if (!tracksResponse.ok) {
            const errorData = await tracksResponse.json();
            setError(errorData.error || "Failed to fetch songs");
            return;
          }
          const tracksData = await tracksResponse.json();
          const filteredTracks = tracksData.filter(
            (track: any, index: number, self: any[]) =>
              index === self.findIndex((t) => t.name === track.name)
          );
          setTopTracks(filteredTracks);

          
          // Fetch related artists
          const relatedArtistsResponse = await fetch(
            `/api/Music/route?type=relatedArtists&artistName=${encodeURIComponent(artist)}`
          );
          if (!relatedArtistsResponse.ok) {
            const errorData = await relatedArtistsResponse.json();
            setError(errorData.error || "Failed to fetch related artists");
            return;
          }
          const relatedArtistsData = await relatedArtistsResponse.json();
          setRelatedArtists(relatedArtistsData);

        } catch (err) {
          console.error("Error fetching data:", err);
          setError("An unexpected error occurred");
        }
      }
      fetchArtistData();

    }
  }, [artist]);

  async function fetchArtistAlbums() {
    // Fetch artist albums
    const albumsResponse = await fetch(
      `/api/Music/route?type=artistAlbums&artistId=${encodeURIComponent(artistDetails.id)}`
    );
    if (!albumsResponse.ok) {
      const errorData = await albumsResponse.json();
      setError(errorData.error || "Failed to fetch artist albums");
      return;
    }
    const albumsData = await albumsResponse.json();
    setArtistAlbums(albumsData);
  }
  if (artistDetails) {
    fetchArtistAlbums();
  }

  if (!artistDetails) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ textAlign: "center", backgroundColor: "#111", padding: "20px", marginTop: "40px" }}>
      <Header />
      {error && <p style={{ color: "red" }}>{error}</p>}
     <h2>Top Tracks</h2>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "10px",
        }}
      >
        {topTracks.map((track, index) => (
          <div
            key={index}
            style={{
              minWidth: "200px",
              backgroundColor: "#222",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={track.albumImage}
              alt={track.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h3>{track.name}</h3>
            <p>
              {track.artists.map((artist, idx) => (
                <span key={artist.id}>
                  <Link href={`/music/${artist.id}`} style={{ color: "#1DB954" }}>
                    {artist.name}
                  </Link>
                  {idx < track.artists.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
        ))}
       
      </div>

            <Footer />

    </div>
  );
}
