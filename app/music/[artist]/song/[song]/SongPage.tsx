"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ID3Writer } from 'browser-id3-writer';
import CommentShareModule from '@/components/CommentShareModule'
import Header from '@/components/Header'
import Footer from "@/components/Footer";
import AudioPlayer from 'react-h5-audio-player';
import { getOrCreateUserId } from "@/utils/generateUserId"; // adjust path if needed

const styles = `
  .song-page {
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    min-height: 100vh;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .song-header {
    background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
    padding: 2rem;
    text-align: center;
    border-radius: 16px;
    margin: 2rem;
    box-shadow: 0 8px 32px rgba(29, 185, 84, 0.3);
  }

  .song-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin: 3rem 2rem;
  }

  .song-cover {
    width: 280px;
    height: 280px;
    border-radius: 16px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
    object-fit: cover;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .song-cover:hover {
    transform: scale(1.02);
    box-shadow: 0 16px 64px rgba(29, 185, 84, 0.4);
  }

  .song-info {
    text-align: center;
  }

  .song-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 1rem 0;
    background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .song-artist {
    font-size: 1.25rem;
    color: #b3b3b3;
    margin: 0.5rem 0;
    font-weight: 500;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 3rem 2rem;
  }

  .detail-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .detail-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(29, 185, 84, 0.5);
    transform: translateY(-4px);
  }

  .detail-label {
    color: #b3b3b3;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .detail-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1ed760;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin: 2rem;
  }

  .btn {
    padding: 12px 28px;
    border: none;
    border-radius: 24px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }

  .btn-primary {
    background: linear-gradient(135deg, #1db954 0%, #1ed760 100%);
    color: #000;
    box-shadow: 0 4px 16px rgba(29, 185, 84, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(29, 185, 84, 0.5);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(29, 185, 84, 0.5);
    color: #1ed760;
  }

  .btn-secondary:hover {
    background: rgba(29, 185, 84, 0.15);
    transform: translateY(-2px);
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 3rem 2rem 1.5rem;
    position: relative;
    padding-left: 1rem;
  }

  .section-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1.2em;
    background: linear-gradient(180deg, #1db954 0%, #1ed760 100%);
    border-radius: 2px;
  }

  .scroll-container {
    display: flex;
    overflow-x: auto;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
    scroll-behavior: smooth;
  }

  .scroll-container::-webkit-scrollbar {
    height: 6px;
  }

  .scroll-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .scroll-container::-webkit-scrollbar-thumb {
    background: #1db954;
    border-radius: 3px;
  }

  .song-card {
    min-width: 140px;
    max-width: 140px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .song-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(29, 185, 84, 0.5);
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(29, 185, 84, 0.2);
  }

  .song-card-image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    transition: transform 0.3s ease;
  }

  .song-card:hover .song-card-image {
    transform: scale(1.05);
  }

  .song-card-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1.3;
  }

  .song-card-artist {
    font-size: 0.75rem;
    color: #b3b3b3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }

  .video-container {
    margin: 3rem 2rem;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .video-container iframe {
    width: 100%;
    aspect-ratio: 16 / 9;
    border: none;
  }

  .player-container {
    margin: 3rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .player-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .lyrics-container {
    margin: 3rem 2rem;
    background: rgba(255, 255, 255, 0.03);
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .lyrics-content {
    line-height: 2;
    color: #d0d0d0;
  }

  .lyrics-section {
    color: #1ed760;
    margin: 1rem 0;
    font-weight: 600;
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    gap: 0.5rem;
  }

  .loading-bar {
    width: 3px;
    height: 24px;
    background: linear-gradient(180deg, #1db954 0%, #1ed760 100%);
    border-radius: 2px;
    animation: pulse 0.8s ease-in-out infinite;
  }

  .loading-bar:nth-child(1) { animation-delay: 0s; }
  .loading-bar:nth-child(2) { animation-delay: 0.1s; }
  .loading-bar:nth-child(3) { animation-delay: 0.2s; }
  .loading-bar:nth-child(4) { animation-delay: 0.3s; }

  @keyframes pulse {
    0%, 100% { height: 24px; opacity: 0.6; }
    50% { height: 48px; opacity: 1; }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: rgba(30, 30, 30, 0.95);
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    border: 1px solid rgba(29, 185, 84, 0.3);
    box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
  }

  @media (max-width: 768px) {
    .song-title {
      font-size: 1.75rem;
    }

    .song-cover {
      width: 200px;
      height: 200px;
    }

    .details-grid {
      grid-template-columns: 1fr;
      margin: 2rem 1rem;
    }

    .section-title {
      font-size: 1.5rem;
      margin: 2rem 1rem 1rem;
    }

    .button-group {
      margin: 1.5rem 1rem;
    }

    .scroll-container {
      padding: 1rem;
      margin: 0 -1rem;
      padding-left: 1rem;
    }

    .video-container {
      margin: 2rem 1rem;
    }

    .player-container {
      margin: 2rem 1rem;
    }

    .lyrics-container {
      margin: 2rem 1rem;
    }
  }
`;

declare global {
    interface Window {
        google: any;
        handleCredentialResponse?: (response: any) => void;
    }
}

interface Track {
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
        release_date: string;
        type: string;
    };
    preview_url: string | null;
    duration_ms: number;
}

export default function SongPage() {
    const { artist, song } = useParams() as { artist: string; song: string };
    const [track, setTrack] = React.useState<Track | null>(null);
    const [videoId, setVideoId] = React.useState<string | null>(null);
    const [lyricsVideoId, setLyricsVideoId] = React.useState<string | null>(null);
    const [songs, setSongs] = React.useState<any[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] = React.useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
    const [showSelect, setShowSelect] = React.useState(false);
    const [lyricsHtml, setLyricsHtml] = React.useState<string>("Loading lyrics...");
    const [relatedSongs, setRelatedSongs] = React.useState<any[]>([]);
    const router = useRouter();
    const [googleClientId, setGoogleClientId] = React.useState<string | null>(null);
    const [userInfo, setUserInfo] = React.useState<any>(null);
    // const [showModal, setShowModal] = React.useState(false);
   
    React.useEffect(() => {
        fetch('/api/Music/route?type=clientId')
            .then(res => res.json())
            .then(data => setGoogleClientId(data.clientId));

        // Check for stored user info
        const stored = localStorage.getItem('userInfo');
        if (stored) {
            setUserInfo(JSON.parse(stored));
        }
    }, []);

    React.useEffect(() => {
        if (!googleClientId) return;

        // Add Google script if not already present
        if (!document.getElementById('google-gsi-script')) {
            const googleScript = document.createElement('script');
            googleScript.src = 'https://accounts.google.com/gsi/client';
            googleScript.async = true;
            googleScript.defer = true;
            googleScript.id = 'google-gsi-script';
            document.body.appendChild(googleScript);

            googleScript.onload = () => {
                window.handleCredentialResponse = (response: any) => {
                    if (response.credential) {
                        const data = parseJwt(response.credential);
                        saveUserInfo(data);
                        setUserInfo(data);
                        setTimeout(() => {
                            router.refresh();
                        }, 1000);
                    } else {
                        console.error("Error: No Google credential received.");
                    }
                };

                if (window.google?.accounts?.id) {
                    window.google.accounts.id.initialize({
                        client_id: googleClientId,
                        callback: window.handleCredentialResponse,
                        cancel_on_tap_outside: false,
                    });

                    // Only prompt One Tap if not signed in
                    if (!userInfo) {
                        window.google.accounts.id.prompt();
                    }
                }
            };
        } else {
            // If script already loaded, initialize and prompt as above
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: window.handleCredentialResponse,
                    cancel_on_tap_outside: false,
                });
                if (!userInfo) {
                    window.google.accounts.id.prompt();
                }
            }
        }
    }, [googleClientId, userInfo]);

    const parseJwt = (token: string) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    };

    const saveUserInfo = (data: any) => {
        localStorage.setItem('userInfo', JSON.stringify({
            data,
            provider: "google"
        }));
        setUserInfo(data);

        // Save user details to backend (name, email, image, notificationToken: null)
        fetch('/api/Music/route?type=storeUserDetail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: getOrCreateUserId(), // Ensure you send the user ID
                name: data.name,
                email: data.email,
                image: data.picture,
            })
        })
            .then((res) => {
                if (res.ok) {
                    window.location.reload();
                }
            })
            .catch(() => { });
    };
    // Disable background scroll when modal is open
    React.useEffect(() => {
        if (modalMessage) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [modalMessage]);

    // Fetch main track and related data
    React.useEffect(() => {
        if (!artist || !song) return;
        setError(null);
        setTrack(null);
        setVideoId(null);
        setLyricsVideoId(null);
        setDownloadUrl(null);
        setLyricsHtml("Loading lyrics...");
        setSongs([]);

        async function fetchData() {
            try {
                // Fetch song details
                const response = await fetch(
                    `/api/Music/route?type=songDetails&artistName=${encodeURIComponent(artist)}&songName=${encodeURIComponent(song)}`
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.error || "Failed to fetch song details");
                    return;
                }
                const trackData = await response.json();
                console.log("Song Track Data:", trackData);
                console.log("Artists from API:", trackData.artists?.map((a: any) => a.name));
                console.log("URL Artist Param:", artist);
                setTrack(trackData);

                // Fetch YouTube video
                const videoResponse = await fetch(
                    `/api/Music/route?type=youtubeMusicVideo&artistName=${encodeURIComponent(artist)}&songName=${encodeURIComponent(song)}`
                );
                const videoData = await videoResponse.json();
                if (videoData.videoId) setVideoId(videoData.videoId);

                // Fetch lyrics video
                const lyricsVideoResponse = await fetch(
                    `/api/Music/route?type=lyricsVideo&artistName=${encodeURIComponent(artist)}&songName=${encodeURIComponent(song)}`
                );
                const lyricsVideoData = await lyricsVideoResponse.json();
                if (lyricsVideoData.videoId) setLyricsVideoId(lyricsVideoData.videoId);

                // Fetch and display lyrics
                fetchAndDisplayLyrics(artist, song);

                // Fetch related songs
                fetchSongs(song);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("An unexpected error occurred");
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, [artist, song]);

    // Fetch and format lyrics
    async function fetchAndDisplayLyrics(artistName: string, songName: string) {
        try {
            const response = await fetch(
                `/api/Music/route?type=lyrics&artistName=${encodeURIComponent(artistName)}&songName=${encodeURIComponent(songName)}`
            );
            if (!response.ok) throw new Error("Failed to fetch lyrics");
            const data = await response.json();
            if (data.lyrics) {
                setLyricsHtml(formatLyrics(data.lyrics));
            } else {
                setLyricsHtml("Lyrics not found.");
            }
        } catch (error) {
            setLyricsHtml("Failed to load lyrics.");
        }
    }

    function formatLyrics(lyrics: string) {
        return lyrics
            .replace(/(.*?)/g, '<div class="lyrics-section"><strong>[$1]</strong></div>')
            .replace(/\n/g, "<br>");
    }
    React.useEffect(() => {
        async function fetchRelatedTracks() {
            try {
                const response = await fetch(
                    `/api/Music/route?type=relatedTracks&artistName=${encodeURIComponent(artist)}&songName=${encodeURIComponent(song)}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch related tracks");
                }

                const relatedTracks = await response.json();
                console.log("Related Tracks:", relatedTracks);
                setRelatedSongs(relatedTracks);
            } catch (err) {
                console.error("Error fetching related tracks:", err);
            }
        }
        if (artist && song) {
            fetchRelatedTracks();
        }

    }, [artist, song]);

    // Fetch songs
    async function fetchSongs(songName: string) {
        try {
            const response = await fetch(
                `/api/Music/route?type=artistSongs&artistName=${encodeURIComponent(artist)}`
            );
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Failed to fetch songs");
                return;
            }
            const songsData = await response.json();
            // Filter out duplicates and the current song
            const filteredSongs = songsData
                .filter(
                    (song: any, index: number, self: any[]) =>
                        song.name.toLowerCase() !== songName.toLowerCase() &&
                        self.findIndex((s) => s.name.toLowerCase() === song.name.toLowerCase()) === index
                );
            setSongs(filteredSongs);
        } catch (err) {
            setError("An unexpected error occurred");
        }
    }


    // Increment visit count in localStorage every time this page is loaded
    React.useEffect(() => {
        const visits = Number(localStorage.getItem("redirectVisits") || "0") + 1;
        localStorage.setItem("redirectVisits", visits.toString());
    }, []);
    // Handle smart redirect
    // Add this helper to check GitHub for the file
    async function checkGithubFileExists(fileName: string): Promise<string | null> {
        const artistName = track?.artists[0]?.name || "Unknown Artist";
        const githubRawUrl = `https://raw.githubusercontent.com/CodeNova5/Music-Backend/main/public/music/${artistName}/${fileName}`;
        try {
            const res = await fetch(githubRawUrl, { method: "HEAD" });
            if (res.ok) {
                return githubRawUrl;
            }
            return null;
        } catch {
            return null;
        }
    }

    React.useEffect(() => {
        if (!lyricsVideoId || !track) return;

        const formatTitle = (title: string): string =>
            title
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join("-");

        const fileName = `${formatTitle(track.artists[0]?.name ?? "")}_-_${formatTitle(track.name ?? "")}.mp3`;

        async function processAudio() {
            if (!lyricsVideoId || !track) return;

            // 1. Check if file exists in GitHub
            const githubUrl = await checkGithubFileExists(fileName);
            if (githubUrl) {
                setDownloadUrl(githubUrl);
                return;
            }

            setIsUploading(true);

            try {
                // 1. Fetch YouTube audio
                const ytResponse = await fetch(
                    `/api/Music/route?type=youtubeToMp3&videoId=${lyricsVideoId}`
                );
                if (!ytResponse.ok) throw new Error("Failed to fetch audio");
                const data = await ytResponse.json();
                if (!data.downloadLink) throw new Error("No audio URL found");

                const mp3Response = await fetch(data.downloadLink);
                const mp3Blob = await mp3Response.blob();
                const arrayBuffer = await mp3Blob.arrayBuffer();

                // 2. Add metadata
                const writer = new ID3Writer(arrayBuffer);
                writer
                    .setFrame("TIT2", track.name ?? "Unknown Title")
                    .setFrame("TPE1", [track.artists[0]?.name ?? "Unknown Artist"])
                    .setFrame("TALB", track.album?.name ?? "Unknown Album");

                const coverImageUrl = track.album?.images[0]?.url;
                if (coverImageUrl) {
                    const coverResponse = await fetch(coverImageUrl);
                    const coverBlob = await coverResponse.blob();
                    const coverArrayBuffer = await coverBlob.arrayBuffer();
                    (writer as any).setFrame("APIC", {
                        type: 3,
                        data: new Uint8Array(coverArrayBuffer),
                        description: "Cover",
                    });
                }

                writer.addTag();
                const taggedBlob = writer.getBlob();
                const url = window.URL.createObjectURL(taggedBlob);

                setDownloadUrl(url);

                // 3. Upload to GitHub
                const artistName = track.artists[0]?.name || "Unknown Artist";
                console.log("Uploading to GitHub:");
                await uploadFileToGithub(artistName, fileName, taggedBlob);
            } catch (err) {
                setModalMessage("An unexpected error occurred");
                setTimeout(() => setModalMessage(null), 1000);
            } finally {
                setIsUploading(false);
            }
        }


        if (lyricsVideoId && track && !downloadUrl) {
            processAudio();
        }
        // eslint-disable-next-line
    }, [lyricsVideoId, track]);


    // Add this helper to upload using FormData (for formidable)
    async function uploadFileToGithub(artistName: string, fileName: string, blob: Blob) {
        const formData = new FormData();
        formData.append("file", blob, fileName);
        formData.append("fileName", fileName);
        formData.append("artistName", artistName);
        await fetch("/api/comments/uploadFile?type=music", {
            method: "POST",
            body: formData,
        });
    }



    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const artistName = e.target.value;
        if (artistName) {
            router.push(`/music/${encodeURIComponent(artistName)}`);
        }
    };
    // Remove the invalid useEffect and handle "song not found" in the render logic below.
    const decodedArtist = decodeURIComponent(artist);
    
    // Helper function to normalize artist names for comparison
    const normalizeArtistName = (name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s]/g, '') // Remove special characters
            .replace(/\s+/g, ' '); // Normalize spaces
    };
    
    const artistMismatch = 
        track &&
        decodedArtist &&
        !track.artists?.some((a: any) => {
            const normalized = normalizeArtistName(a.name || '');
            const decodedNormalized = normalizeArtistName(decodedArtist);
            
            // Log for debugging (can be removed later)
            if (normalized !== decodedNormalized) {
                console.log(`Artist mismatch - API: "${normalized}", URL: "${decodedNormalized}"`);
            }
            
            return normalized === decodedNormalized;
        });
    
    // Show error only if we can't find the song at all, don't block display due to artist name mismatch
    const songNotFound = false; // Disabled - we'll show song even if artist doesn't match perfectly

    if (songNotFound) {
        return (
            <div className="song-page">
                <style>{styles}</style>
                <Header />
                <div style={{ textAlign: "center", marginTop: "100px", padding: "2rem" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>🎵 Song Not Found</h1>
                    <p style={{ fontSize: "1.1rem", color: "#b3b3b3", marginBottom: "1rem" }}>
                        The song you are looking for does not exist for artist: <strong>{decodedArtist}</strong>
                    </p>
                    {track?.artists && (
                        <p style={{ fontSize: "0.95rem", color: "#888", marginBottom: "2rem" }}>
                            Found on: <strong>{track.artists.map((a: any) => a.name).join(", ")}</strong>
                        </p>
                    )}
                    <Link href="/" className="btn btn-primary" style={{ padding: "12px 32px", fontSize: "1rem" }}>
                        ← Return to Homepage
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    if (!track) {
        return (
            <div className="song-page">
                <style>{styles}</style>
                <div className="loading-spinner">
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                    <div className="loading-bar"></div>
                </div>
            </div>
        );
    }


    return (
        <div className="song-page">
            <style>{styles}</style>
            <Header />

            {/* Artist Mismatch Warning */}
            {artistMismatch && (
                <div style={{
                    backgroundColor: "rgba(255, 193, 7, 0.1)",
                    border: "1px solid rgba(255, 193, 7, 0.5)",
                    borderRadius: "8px",
                    padding: "1rem",
                    margin: "1.5rem 2rem",
                    color: "#ffc107",
                    fontSize: "0.95rem"
                }}>
                    ⚠️ Note: This song was found as "{track?.artists?.map((a: any) => a.name).join(", ")}" instead of "{decodedArtist}". This might be a collaboration or alternate artist credit.
                </div>
            )}

            {/* Song Hero Section */}
            <div className="song-hero">
                <img 
                    src={track.album.images[0]?.url || "/placeholder.jpg"} 
                    alt={track.name} 
                    className="song-cover"
                />
                <div className="song-info">
                    <h1 className="song-title">{track.name}</h1>
                    <p className="song-artist">
                        {track.artists.map((a) => a.name).join(", ")}
                    </p>
                </div>
            </div>

            {/* Details Section */}
            <div className="details-grid">
                <div className="detail-card">
                    <div className="detail-label">🎤 Artist(s)</div>
                    <div className="detail-value">{track.artists.map((a) => a.name).join(", ")}</div>
                </div>
                <div className="detail-card">
                    <div className="detail-label">💿 Album</div>
                    <div className="detail-value">{track.album.name}</div>
                </div>
                <div className="detail-card">
                    <div className="detail-label">⏱️ Duration</div>
                    <div className="detail-value">
                        {track.duration_ms
                            ? `${Math.floor(track.duration_ms / 60000)}:${(
                                (track.duration_ms % 60000) /
                                1000
                            )
                                .toFixed(0)
                                .padStart(2, "0")}`
                            : "N/A"}
                    </div>
                </div>
                <div className="detail-card">
                    <div className="detail-label">📅 Release Date</div>
                    <div className="detail-value">{track.album.release_date || "N/A"}</div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
                {track.artists.length > 1 ? (
                    !showSelect ? (
                        <button
                            onClick={() => setShowSelect(true)}
                            className="btn btn-primary"
                        >
                            👥 View All Artists
                        </button>
                    ) : (
                        <select
                            onChange={handleSelect}
                            defaultValue=""
                            style={{
                                padding: '12px 20px',
                                backgroundColor: 'rgba(29, 185, 84, 0.15)',
                                color: '#1ed760',
                                border: '2px solid #1db954',
                                borderRadius: '24px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="" disabled>Select an artist</option>
                            {track.artists.map((artist, index) => (
                                <option key={index} value={artist.name}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                    )
                ) : (
                    <Link href={`/music/${encodeURIComponent(track.artists[0].name)}`} className="btn btn-secondary">
                        👤 View Artist
                    </Link>
                )}
                <a
                    onClick={async (e) => {
                        const cleanFileName = `${track.artists[0]?.name.replace(/ /g, "-")}_-_${track.name.replace(/ /g, "-")}.mp3`;
                        if (!downloadUrl) {
                            e.preventDefault();
                            setIsUploading(true);
                            setModalMessage("⏳ Preparing download...");
                        } else {
                            setModalMessage("✅ Download has started");
                            setTimeout(() => setModalMessage(null), 2000);
                            setIsUploading(false);
                            const fileUrl = downloadUrl;
                            fetch(fileUrl)
                                .then(response => response.blob())
                                .then(blob => {
                                    const link = document.createElement("a");
                                    link.href = URL.createObjectURL(blob);
                                    link.download = cleanFileName;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                })
                                .catch(console.error);
                        }
                    }}
                    className="btn btn-primary"
                    style={{ cursor: 'pointer' }}
                >
                    ⬇️ Download MP3
                </a>
            </div>

            {/* Video Section */}
            {videoId && (
                <div>
                    <h2 className="section-title">🎬 Official Video</h2>
                    <div className="video-container">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            allowFullScreen
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Audio Player */}
            <div>
                <h2 className="section-title">🎵 Listen Now</h2>
                <div className="player-container">
                    {!downloadUrl ? (
                        <p className="player-title">⏳ Preparing audio, please wait...</p>
                    ) : (
                        <AudioPlayer
                            src={downloadUrl}
                            style={{ borderRadius: "8px" }}
                        />
                    )}
                </div>
            </div>

            {/* Lyrics Section */}
            <div>
                <h2 className="section-title">📝 Lyrics</h2>
                <div className="lyrics-container">
                    <div className="lyrics-content" dangerouslySetInnerHTML={{ __html: lyricsHtml }} />
                </div>
            </div>

            {/* Songs by Artist */}
            {songs.length > 0 && (
                <div>
                    <h2 className="section-title">🎶 More from {track.artists[0]?.name}</h2>
                    <div className="scroll-container">
                        {songs.map((song, index) => (
                            <Link 
                                key={index}
                                href={`/music/${encodeURIComponent(song.artists[0]?.name)}/song/${encodeURIComponent(song.name)}`}
                                className="song-card"
                            >
                                <img
                                    src={song.albumImage || "/placeholder.jpg"}
                                    alt={song.name}
                                    className="song-card-image"
                                />
                                <h3 className="song-card-title">{song.name}</h3>
                                <p className="song-card-artist">
                                    {song.artists.map((a: any) => a.name).join(", ")}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Tracks */}
            {relatedSongs.length > 0 && (
                <div>
                    <h2 className="section-title">🔗 Related Tracks</h2>
                    <div className="scroll-container">
                        {relatedSongs.map((song, index) => (
                            <Link 
                                key={index}
                                href={`/music/${encodeURIComponent(song.artist)}/song/${encodeURIComponent(song.name)}`}
                                className="song-card"
                            >
                                <img
                                    src={song.image || "/placeholder.jpg"}
                                    alt={song.name}
                                    className="song-card-image"
                                />
                                <h3 className="song-card-title">{song.name}</h3>
                                <p className="song-card-artist">{song.artist}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div style={{ margin: "3rem 2rem" }}>
                <h2 className="section-title">💬 Comments & Shares</h2>
                <CommentShareModule track={track} album={undefined} artist={undefined} playlist={undefined} />
            </div>

            {/* Modal */}
            {modalMessage && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="modal-text">{modalMessage}</p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}