const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const ARTIST_CLIENT_ID = process.env.ARTIST_CLIENT_ID;
const ARTIST_CLIENT_SECRET = process.env.ARTIST_CLIENT_SECRET;
const ALBUM_CLIENT_ID = process.env.ALBUM_CLIENT_ID;
const ALBUM_CLIENT_SECRET = process.env.ALBUM_CLIENT_SECRET;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_KEY2 = process.env.YOUTUBE_API_KEY2;
const LAST_FM_API_KEY = process.env.LAST_FM_API_KEY;
const LAST_FM_API_KEY2 = process.env.LAST_FM_API_KEY2;
import nodemailer from "nodemailer";
import { redis } from "../../components/redis.js";  // ✅ only one client reused
let spotifyAccessToken = null;
let spotifyTokenExpiresAt = 0;
let albumTokenExpiresAt = 0;
let artistAccessToken = null;
let albumAccessToken = null;
import axios from "axios";
import { SongCache } from "../../models/songCache.js";
import { ArtistAlbumsCache } from "../../models/songCache.js";
import { ArtistSongsCache } from "../../models/songCache.js";
import { TopSongsCache } from "../../models/songCache.js";
import { connectDB } from "../../lib/mongodb.js";
let artistTokenExpiresAt = 0;

async function getSpotifyAccessToken() {
  if (spotifyAccessToken && Date.now() < spotifyTokenExpiresAt) {
    return spotifyAccessToken;
  }

  const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResponse.ok) throw new Error("Failed to get access token");

  const tokenData = await tokenResponse.json();
  spotifyAccessToken = tokenData.access_token;
  spotifyTokenExpiresAt = Date.now() + tokenData.expires_in * 1000;
  return spotifyAccessToken;
}

async function getLyricsFromGenius(artist, song) {
  try {
    function cleanLyrics(rawLyrics) {
      // Start from first [Verse]/[Chorus]/etc.
      const startMatch = rawLyrics.match(/\[(Verse|Chorus|Pre-Chorus|Bridge|Intro|Outro).*?\]/i);
      let lyrics = startMatch ? rawLyrics.slice(startMatch.index).trim() : rawLyrics.trim();

      // Remove trailing [Music Video], [Credits], etc.
      lyrics = lyrics.replace(/\[.*?(Video|Credits|Produced|Instrumental).*?\]$/gi, "").trim();

      return lyrics;
    }

    // Step 1: Search Genius for the song
    const searchUrl = `https://genius.com/api/search/song?q=${encodeURIComponent(artist + " " + song)}`;
    const searchRes = await axios.get(searchUrl);
    const hits = searchRes.data.response.sections[0].hits;

    if (!hits.length) return null;

    // Step 2: Get the song URL
    const songUrl = hits[0].result.url;

    // Step 3: Fetch the page HTML
    const pageRes = await axios.get(songUrl);
    const $ = cheerio.load(pageRes.data);

    // Step 4: Extract lyrics
    let lyrics = "";
    $("div[data-lyrics-container=true]").each((i, elem) => {
      lyrics += $(elem).text() + "\n";
    });
    lyrics = cleanLyrics(lyrics);
    return { url: songUrl, lyrics: lyrics.trim() };
  } catch (err) {
    console.error("Genius scrape error:", err.message);
    return null;
  }
}


export async function getLyrics(artist, song) {
  const lyricsData = await getLyricsFromGenius(artist, song);
  if (lyricsData) {
    return lyricsData;
  } else {
    return { url: null, lyrics: "Lyrics not found." };
  }
}

async function getAlbumAccessToken() {
  if (albumAccessToken && Date.now() < albumTokenExpiresAt) {
    return albumAccessToken;
  }
  const authString = Buffer.from(`${ALBUM_CLIENT_ID}:${ALBUM_CLIENT_SECRET}`).toString("base64");
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!tokenResponse.ok) throw new Error("Failed to get access token");
  const tokenData = await tokenResponse.json();
  albumAccessToken = tokenData.access_token;
  albumTokenExpiresAt = Date.now() + tokenData.expires_in * 1000;
  return albumAccessToken;
}
async function getArtistAccessToken() {
  if (artistAccessToken && Date.now() < artistTokenExpiresAt) {
    return artistAccessToken;
  }

  const authString = Buffer.from(`${ARTIST_CLIENT_ID}:${ARTIST_CLIENT_SECRET}`).toString("base64");
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResponse.ok) throw new Error("Failed to get access token");

  const tokenData = await tokenResponse.json();
  artistAccessToken = tokenData.access_token;
  artistTokenExpiresAt = Date.now() + tokenData.expires_in * 1000;
  return artistAccessToken;
}

async function fetchWithSpotifyTokens(url, getToken1, getToken2) {
  // Try with first token
  let token = await getToken1();
  let response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  // If 429, try with second token
  if (response.status === 429 && getToken2) {
    token = await getToken2();
    response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  }

  // If still 429, wait and retry ONCE
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || "1", 10);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  }

  return response;
}

async function fetchWithLastFmKeys(url, getKey1, getKey2) {
  // Try with first API key
  let apiKey = await getKey1();
  let urlWithKey = new URL(url);
  urlWithKey.searchParams.set('api_key', apiKey);
  urlWithKey.searchParams.set('format', 'json'); // Last.fm usually requires this

  let response = await fetch(urlWithKey.toString());
  let data = await response.json();

  // If rate limited (HTTP 429 or Last.fm specific error code 29)
  if ((response.status === 429 || data.error === 29) && getKey2) {
    apiKey = await getKey2();
    urlWithKey.searchParams.set('api_key', apiKey);

    response = await fetch(urlWithKey.toString());
    data = await response.json();
  }

  // Retry ONCE if still rate-limited
  if (response.status === 429 || data.error === 29) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));

    response = await fetch(urlWithKey.toString());
    data = await response.json();
  }

  return { response, data };
}
async function fetchWithYouTubeAPI(url, getKey1, getKey2) {
  // Try with first API key
  let apiKey = await getKey1();
  let urlWithKey = new URL(url);
  urlWithKey.searchParams.set('key', apiKey);
  let response = await fetch(urlWithKey.toString());
  let data = await response.json();
  // If rate limited (HTTP 429)
  if (response.status === 429 && getKey2) {
    apiKey = await getKey2();
    urlWithKey.searchParams.set('key', apiKey);

    response = await fetch(urlWithKey.toString());
    data = await response.json();
  }
  // Retry ONCE if still rate-limited
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));

    response = await fetch(urlWithKey.toString());
    data = await response.json();
  }
  return { response, data };

}

async function sendLimitExceededEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "netdot1234@gmail.com", // your Gmail
        pass: "zhoz tqip esoz vcpc", // app password
      },
    });

    await transporter.sendMail({
      from: "netdot1234@gmail.com",
      to: "codenova02@gmail.com",
      subject: "RapidAPI Limit Exceeded",
      text: "Your primary RapidAPI key has exceeded its limit.",
    });

    console.log("📧 Email sent to codenova02@gmail.com");
  } catch (mailErr) {
    console.error("❌ Failed to send email:", mailErr);
  }
}
export default async function handler(req, res) {
  try {
    const { type, artistName, songName, artistId, albumId, playlistId, playlistType } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Missing type parameter (spotify or youtube)" });
    }

    // Decode before using
    const decodedArtistName = decodeURIComponent(artistName || "");
    const decodedSongName = decodeURIComponent(songName || "");

    if (type === "search") {
      const query = req.query.query;
      const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist,track,album&limit=5`;
      const response = await fetchWithSpotifyTokens(
        apiUrl,
        getSpotifyAccessToken,
        getArtistAccessToken
      );

      const json = await response.json();
      return res.status(200).json(json);
    }

    else if (type === "songDetails") {
      if (!artistName || !songName) {
        return res.status(400).json({ error: "Missing artist name or song name" });
      }

      try {
        const cacheKey = `song:${decodedArtistName}:${decodedSongName}`;
        let songData = null;

        // 🟡 1. Try MongoDB cache
        await connectDB();
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("✅ MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=31536000, immutable");
          return res.status(200).json(mongoCache.data);
        }

        // 🔵 2. Fetch from Spotify if not cached anywhere
        const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          `${decodedArtistName} ${decodedSongName}`
        )}&type=track&limit=1`;

        const response = await fetchWithSpotifyTokens(
          apiUrl,
          getSpotifyAccessToken,
          getArtistAccessToken
        );

        if (!response.ok) {
          throw new Error("Failed to fetch song details");
        }

        const data = await response.json();
        if (!data.tracks?.items?.length) {
          return res.status(404).json({ error: "Song not found" });
        }

        const track = data.tracks.items[0];

        songData = {
          name: track.name,
          artists: track.artists.map((artist) => ({ name: artist.name })),
          album: {
            name: track.album.name,
            images: track.album.images,
            release_date: track.album.release_date,
          },
          duration_ms: track.duration_ms,
        };

        // 🔄 3. Save new cache
        await SongCache.updateOne(
          { cacheKey },
          { $set: { data: songData, createdAt: new Date() } },
          { upsert: true }
        );

        // ✅ 4. Respond
        res.setHeader("Cache-Control", "public, s-maxage=31536000, immutable");
        return res.status(200).json(songData);

      } catch (err) {
        console.error("Spotify API Error:", err);
        return res.status(500).json({ error: "Failed to fetch song details" });
      }
    }


    else if (type === "clientId") {
      res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
      res.status(200).json({ clientId: process.env.GOOGLE_CLIENT_ID });
    }


    else if (type === "youtubeMusicVideo") {
      if (!songName || !artistName) {
        return res.status(400).json({ error: "Missing song name or artist name" });
      }

      try {
        const cacheKey = `youtube:${decodedArtistName}:${decodedSongName}`;

        // Try mongodb cache next
        await connectDB();
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=7776000, immutable");
          return res.status(200).json(mongoCache.data);
        }

        // 2️⃣ Build query & fetch from YouTube API
        const query = `${decodedArtistName} ${decodedSongName} official music video`;
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1`;

        const { response, data } = await fetchWithYouTubeAPI(
          apiUrl,
          () => YOUTUBE_API_KEY,
          () => YOUTUBE_API_KEY2
        );

        if (!response.ok) throw new Error("Failed to fetch YouTube video");

        if (!data.items || data.items.length === 0) {
          return res.status(404).json({ error: "No video found for this song" });
        }

        const videoId = data.items[0].id.videoId;
        const videoData = { videoId };

        // 3️⃣ Save to MongoDB
        await SongCache.updateOne(
          { cacheKey },
          { $set: { data: videoData, createdAt: new Date() } },
          { upsert: true }
        );
        // 4️⃣ Return fresh data long cache headers
        res.setHeader("Cache-Control", "public, s-maxage=7776000, immutable");
        return res.status(200).json(videoData);
      } catch (err) {
        console.error("YouTube API Error:", err);
        return res.status(500).json({ error: "Failed to fetch YouTube video" });
      }
    }

    else if (type === "lyricsVideo") {
      if (!songName || !artistName) {
        return res.status(400).json({ error: "Missing song name or artist name" });
      }

      try {
        const cacheKey = `lyricsVideo:${decodedArtistName}:${decodedSongName}`;
        await connectDB();

        // 🔹 Try MongoDB cache
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=31536000, immutable");
          return res.status(200).json(mongoCache.data);
        }

        // 🔹 Fetch from YouTube
        const query = `${decodedArtistName} ${decodedSongName} lyrics video`;
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5`;

        const { response, data } = await fetchWithYouTubeAPI(
          apiUrl,
          () => YOUTUBE_API_KEY,
          () => YOUTUBE_API_KEY2
        );

        if (!response.ok) throw new Error("Failed to fetch YouTube video");
        if (!data.items || data.items.length === 0) {
          return res.status(404).json({ error: "No lyrics video found for this song" });
        }

        // 🔹 Filter the results more strictly
        const normalizedSong = decodedSongName.toLowerCase().replace(/[^\w\s]/g, "");
        const normalizedArtist = decodedArtistName.toLowerCase().replace(/[^\w\s]/g, "");

        const matched = data.items.find(item => {
          const title = item.snippet.title.toLowerCase().replace(/[^\w\s]/g, "");
          const channel = item.snippet.channelTitle.toLowerCase();
          return (
            title.includes(normalizedSong) &&
            (title.includes(normalizedArtist) || channel.includes(normalizedArtist))
          );
        });

        if (!matched) {
          return res.status(404).json({ error: "No accurate lyrics video match found" });
        }

        const videoId = matched.id.videoId;
        const videoData = { videoId };

        // 🔹 Cache result
        await SongCache.updateOne(
          { cacheKey },
          { $set: { data: videoData, createdAt: new Date() } },
          { upsert: true }
        );

        res.setHeader("Cache-Control", "max-age=31536000, immutable");
        return res.status(200).json({ videoId });

      } catch (err) {
        console.error("YouTube API Error:", err);
        return res.status(500).json({ error: "Failed to fetch YouTube lyrics video" });
      }
    }

    else if (type === "youtubeToMp3") {
      const videoId = req.query.videoId;
      if (!videoId) {
        return res.status(400).json({ error: "Missing videoId parameter" });
      }

      async function fetchFromRapidAPI(apiKey) {
        const options = {
          method: "GET",
          url: "https://youtube-mp36.p.rapidapi.com/dl",
          params: { id: videoId },
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
          },
        };
        return axios.request(options);
      }

      try {
        let response;
        try {
          // First attempt with primary key
          response = await fetchFromRapidAPI(process.env.RAPIDAPI_KEY);
        } catch (err) {
          if (err.response?.status === 429 || err.response?.status === 500) {
            console.warn("⚠️ Primary RapidAPI key limit exceeded, retrying with secondary key...");

            // Retry with secondary key
            response = await fetchFromRapidAPI(process.env.RAPIDAPI_KEY2);
            // Send email
            await sendLimitExceededEmail();
          } else {
            throw err;
          }
        }

        if (response.data.status === "ok") {
          console.log("MP3 Download Link:", response.data.link);
          res.setHeader("Cache-Control", "max-age=31536000, immutable");
          return res.status(200).json({ downloadLink: response.data.link });
        } else {
          return res.status(500).json({ error: response.data.msg || "Failed to get download link" });
        }
      } catch (err) {
        console.error("❌ MP3 Download Error:", err);
        return res.status(500).json({ error: "Failed to fetch MP3 download link" });
      }
    }


    else if (type === "lyrics") {
      if (!artistName || !songName) {
        return res.status(400).json({ error: "Missing artist name or song name" });
      }

      try {
        // 1️⃣ Try Lyrics.ovh API first
        const lyricsApiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(decodedArtistName)}/${encodeURIComponent(decodedSongName)}`;
        const response = await fetch(lyricsApiUrl);
        const data = await response.json();

        if (response.ok && data.lyrics) {
          res.setHeader("Cache-Control", "public, s-maxage=31536000, immutable");
          return res.status(200).json({ lyrics: data.lyrics });
        }

        // 2️⃣ Fallback to Genius scraping
        const lyricsData = await getLyrics(decodedArtistName, decodedSongName);
        if (lyricsData && lyricsData.lyrics) {
          res.setHeader("Cache-Control", "public, s-maxage=31536000, immutable");
          return res.status(200).json({ lyrics: lyricsData.lyrics, url: lyricsData.url });
        }

        return res.status(404).json({ error: "Lyrics not found" });
      } catch (err) {
        console.error("Lyrics API Error:", err);
        return res.status(500).json({ error: "Failed to fetch lyrics" });
      }
    }


    else if (type === "artistSongs") {
      if (!artistName) {
        return res.status(400).json({ error: "Missing artist name" });
      }

      try {
        const cacheKey = `artistSongs:${decodedArtistName}`;
        let artistSongs = null;

        //  Try MongoDB cache first
        await connectDB();
        const mongoCache = await ArtistSongsCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("✅ MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }

        // 🔹 3. Fetch from Spotify
        const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          decodedArtistName
        )}&type=track&limit=30`;

        const response = await fetchWithSpotifyTokens(
          apiUrl,
          getSpotifyAccessToken,
          getArtistAccessToken
        );

        if (!response.ok) {
          throw new Error("Failed to fetch artist's songs");
        }

        const data = await response.json();
        if (!data.tracks?.items?.length) {
          return res.status(404).json({ error: "No songs found for this artist" });
        }

        // 🔹 Filter tracks to only keep ones where the artist matches
        const filteredTracks = data.tracks.items.filter(track =>
          track.artists.some(a =>
            a.name.toLowerCase() === decodedArtistName.toLowerCase()
          )
        );

        if (!filteredTracks.length) {
          return res.status(404).json({ error: "No exact matches for this artist" });
        }

        // Keep only required fields
        artistSongs = filteredTracks.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => ({ name: artist.name })),
          albumImage: track.album.images[0]?.url || "/placeholder.jpg",
        }));

        // 🔹 5. Save to MongoDB
        await ArtistSongsCache.updateOne(
          { cacheKey },
          { $set: { data: artistSongs, createdAt: new Date() } },
          { upsert: true }
        );

        res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate");
        return res.status(200).json(artistSongs);

      } catch (err) {
        console.error("Spotify API Error:", err);
        return res.status(500).json({ error: "Failed to fetch artist's songs" });
      }
    }


    else if (type === "relatedTracks") {
      if (!artistName || !songName) {
        return res.status(400).json({ error: "Missing artist name or song name" });
      }

      try {
        const cacheKey = `relatedTracks:${decodedArtistName}:${decodedSongName}`;

        // Try MongoDB cache first
        await connectDB();
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=2419200, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }
        // 3️⃣ Fetch from Last.fm if not cached
        const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(
          decodedArtistName
        )}&track=${encodeURIComponent(decodedSongName)}&limit=15&api_key=${LAST_FM_API_KEY}&format=json`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch related tracks");
        }

        const data = await response.json();
        let tracks = data.similartracks?.track;

        if (!tracks) {
          return res.status(404).json({ error: "No related tracks found" });
        }

        if (!Array.isArray(tracks)) {
          tracks = [tracks]; // normalize
        }

        if (!tracks.length) {
          return res.status(404).json({ error: "No related tracks found" });
        }

        // Map directly from track.getsimilar results
        const relatedTracksRaw = tracks.map((track) => ({
          name: track.name,
          artist: track.artist.name,
        }));

        // Fetch Spotify images for each track
        const accessToken = await getAlbumAccessToken();
        const relatedTracks = await Promise.all(
          relatedTracksRaw.map(async (track) => {
            try {
              const spotifyApiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                `${track.artist} ${track.name}`
              )}&type=track&limit=1`;

              const spotifyResponse = await fetch(spotifyApiUrl, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });

              if (!spotifyResponse.ok) throw new Error("Spotify fetch failed");

              const spotifyData = await spotifyResponse.json();
              const image =
                spotifyData.tracks?.items?.[0]?.album?.images?.[0]?.url || "/placeholder.jpg";

              return { ...track, image };
            } catch (err) {
              return { ...track, image: "/placeholder.jpg" };
            }
          })
        );


        // 5️⃣ Save to MongoDB
        await SongCache.updateOne(
          { cacheKey },
          { $set: { data: relatedTracks, createdAt: new Date() } },
          { upsert: true }
        );

        res.setHeader(
          "Cache-Control",
          "s-maxage=2419200, stale-while-revalidate"
        );
        return res.status(200).json(relatedTracks);
      } catch (err) {
        console.error("Last.fm API Error:", err);
        return res.status(500).json({ error: "Failed to fetch related tracks" });
      }
    }
    // Artist details endpoints 
    else if (type === "artistDetails") {
      if (!artistName) {
        return res.status(400).json({ error: "Missing artist name" });
      }

      try {
        const cacheKey = `artistDetails:${decodedArtistName}`;
        // 1 Try MongoDB cache first
        await connectDB();
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }
        // 2️⃣ Fetch from Spotify if not cached
        const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          decodedArtistName
        )}&type=artist&limit=1`;

        const response = await fetchWithSpotifyTokens(
          apiUrl,
          getSpotifyAccessToken,
          getArtistAccessToken
        );

        if (!response.ok) {
          ``
          throw new Error("Failed to fetch artist details");
        }

        const data = await response.json();
        if (!data.artists?.items?.length) {
          return res.status(404).json({ error: "Artist not found" });
        }

        const artist = data.artists.items[0];
        // Save to MongoDB
        await SongCache.updateOne(
          { cacheKey },
          {
            $set: {
              data: {
                name: artist.name,
                id: artist.id,
                image: artist.images[0]?.url || null,
                genres: artist.genres || [],
                followers: artist.followers?.total || 0,
                createdAt: new Date(),
              },
            },
          },
          { upsert: true }
        );


        res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
        return res.status(200).json({
          name: artist.name,
          id: artist.id,
          image: artist.images[0]?.url || null,
          genres: artist.genres || [],
          followers: artist.followers?.total || 0,
        });
      } catch (err) {
        console.error("Spotify API Error:", err);
        return res.status(500).json({ error: "Failed to fetch artist details" });
      }
    }

    else if (type === "relatedArtists") {
      if (!artistName) {
        return res.status(400).json({ error: "Missing artist name" });
      }

      try {
        const cacheKey = `relatedArtists:${decodedArtistName}`;
        // 1 Try MongoDB cache first
        await connectDB();
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=2419200, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }

        // Fetch related artists from Last.fm
        const lastFmApiUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(
          decodedArtistName
        )}&limit=20&format=json&api_key=${LAST_FM_API_KEY2}`;

        const lastFmResponse = await fetch(lastFmApiUrl);

        if (!lastFmResponse.ok) {
          throw new Error("Failed to fetch related artists from Last.fm");
        }

        const lastFmData = await lastFmResponse.json();

        if (!lastFmData.similarartists?.artist?.length) {
          return res.status(404).json({ error: "No related artists found" });
        }

        // Map Last.fm response to a cleaner format
        // Make sure no two artist like The weekend & ariana Grande or Jessie J ft. Ariana Grande & Nicki Minaj...

        const relatedArtistsRaw = lastFmData.similarartists.artist.map((artist) => ({
          name: artist.name.trim(),
          url: artist.url || null,
        }));

        // Filter and clean related artists
        const cleanedRelatedArtists = relatedArtistsRaw.filter((artist, index, self) => {
          const name = artist.name.toLowerCase();

          // Skip duplicates (case insensitive)
          const alreadyExists = self.findIndex(a => a.name.toLowerCase() === name) !== index;
          if (alreadyExists) return false;

          // Skip if name looks like a collab or contains multiple artists
          const collabIndicators = [" ft", "feat", "&", " with ", ",", " x ", " and "];
          if (collabIndicators.some(ind => name.includes(ind))) {
            return false;
          }

          // Skip if name looks like a generic or weird term (optional)
          if (name.length < 2 || name.match(/various|soundtrack|mix|cover/)) {
            return false;
          }

          return true;
        });


        // Fetch Spotify image for each artist
        const accessToken = await getAlbumAccessToken();
        const relatedArtists = await Promise.all(
          cleanedRelatedArtists.map(async (artist) => {
            try {
              const spotifyApiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                artist.name
              )}&type=artist&limit=1`;

              const spotifyResponse = await fetch(spotifyApiUrl, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });

              if (!spotifyResponse.ok) throw new Error("Spotify fetch failed");

              const spotifyData = await spotifyResponse.json();
              const image = spotifyData.artists?.items?.[0]?.images?.[0]?.url || "/placeholder.jpg";

              return { ...artist, image };
            } catch (err) {
              return { ...artist, image: "/placeholder.jpg" };
            }
          })
        );

        // save to mongodb
        await SongCache.updateOne(
          { cacheKey },
          { $set: { data: relatedArtists, createdAt: new Date() } },
          { upsert: true }
        );

        res.setHeader("Cache-Control", "s-maxage=2419200, stale-while-revalidate");
        return res.status(200).json(relatedArtists);
      } catch (err) {
        console.error("Last.fm API Error:", err);
        return res.status(500).json({ error: "Failed to fetch related artists" });
      }
    }



    else if (type === "artistAlbums") {
      if (!artistId) {
        return res.status(400).json({ error: "Missing artist Id" });
      }

      try {
        // 1️⃣ Try MongoDB cache first
        await connectDB();
        const cacheKey = `artistAlbums:${artistId}`;
        const mongoCache = await ArtistAlbumsCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }

        // Fetch artist albums
        const apiUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US&limit=10`;
        const albumsResponse = await fetchWithSpotifyTokens(
          apiUrl,
          getSpotifyAccessToken,
          getArtistAccessToken
        );
        if (!albumsResponse.ok) {
          throw new Error("Failed to fetch artist albums from Spotify");
        }
        const albumsData = await albumsResponse.json();
        if (!albumsData.items?.length) {
          return res.status(404).json({ error: "No albums found for this artist" });
        }

        // Save to MongoDB
        const formattedAlbums = albumsData.items.map((album) => ({
          name: album.name,
          artists: album.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
            external_urls: artist.external_urls,
          })),
          releaseDate: album.release_date,
          totalTracks: album.total_tracks,
          image: album.images?.[0]?.url || "/placeholder.jpg",
          id: album.id,
        }));

        await ArtistAlbumsCache.updateOne(
          { cacheKey },
          { $set: { data: formattedAlbums, createdAt: new Date() } },
          { upsert: true }
        );
        console.log("Fetched albums from Spotify for artistId:", artistId);
        res.setHeader("Cache-Control", "s-maxage=7200, stale-while-revalidate");
        return res.status(200).json(albumsData.items.map((album) => ({
          name: album.name,
          artists: album.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
            external_urls: artist.external_urls,
          })),
          releaseDate: album.release_date,
          totalTracks: album.total_tracks,
          image: album.images?.[0]?.url || "/placeholder.jpg",
          id: album.id,
        })));
      } catch (err) {
        console.error("Spotify API Error:", err);
        return res.status(500).json({ error: "Failed to fetch artist albums" });
      }
    }

    else if (type === "albumDetail") {
      if (!albumId) {
        return res.status(400).json({ error: "Missing Album Id" });
      }

      try {
        // 1️⃣ Try MongoDB cache first
        await connectDB();
        const cacheKey = `albumDetail:${albumId}`;
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=31536000, immutable");
          return res.status(200).json(mongoCache.data);
        }
        // Fetch album details
        const apiUrl = `https://api.spotify.com/v1/albums/${albumId}`;
        const albumResponse = await fetchWithSpotifyTokens(
          apiUrl,
          getSpotifyAccessToken,
          getArtistAccessToken
        );
        if (!albumResponse.ok) {
          const errorDetails = await albumResponse.text();
          throw new Error(`Spotify Error: ${errorDetails}`);
        }

        const albumData = await albumResponse.json();

        // Build tracks and trackArtists arrays
        const tracks = albumData.tracks.items.map((track) => ({
          name: track.name,
          duration: track.duration_ms,
          artists: track.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
            external_urls: artist.external_urls,
          })),
        }));

        const formattedAlbum = {
          name: albumData.name,
          releaseDate: albumData.release_date,
          totalTracks: albumData.total_tracks,
          image: albumData.images?.[0]?.url || "/placeholder.jpg",
          id: albumData.id,
          artists: albumData.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
            external_urls: artist.external_urls,
          })),
          tracks: tracks,
        };
        // Save to MongoDB
        await SongCache.updateOne(
          { cacheKey },
          { $set: { data: formattedAlbum, createdAt: new Date() } },
          { upsert: true }
        );
        res.setHeader("Cache-Control", "max-age=31536000, immutable");
        return res.status(200).json(formattedAlbum);
      } catch (err) {
        console.error("Spotify API Error:", err);
        return res.status(500).json({ error: "Failed to fetch album details" });
      }
    }

    else if (type === "topSongs") {
      try {
        const cacheKey = "topSongs";

        // 1️⃣ MongoDB cache first
        await connectDB();
        const mongoCache = await TopSongsCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }

        // 2️⃣ Billboard API request using axios (like ok.js)
        // Use a date two weeks before today in YYYY-MM-DD format
        const today = new Date();
        today.setDate(today.getDate() - 14);
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const options = {
          method: 'GET',
          url: 'https://billboard2.p.rapidapi.com/billboard_global_200_excl_us',
          params: { date: todayStr },
          headers: {
            'x-rapidapi-key': 'efa960acdemsha3194f4039be00cp19921ajsn62dacf76f6ed',
            'x-rapidapi-host': 'billboard2.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);

        // 3️⃣ Format top songs
        const topSongs = response.data.map((song) => ({
          rank: song.rank || song.position || 0,
          title: song.title || song.song || "Unknown Title",
          artist: song.artist || song.artist_name || "Unknown Artist",
          image: song.image || song.cover || "/placeholder.jpg",
        }));

        // promise all and get images using spotify
        const accessToken = await getSpotifyAccessToken();
        const topSongsWithImages = await Promise.all(
          topSongs.map(async (song) => {
            try {
              const spotifyApiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                `${song.artist} ${song.title}`
              )}&type=track&limit=1`;
              const spotifyResponse = await fetch(spotifyApiUrl, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (!spotifyResponse.ok) {
                throw new Error(`Failed to fetch Spotify data for ${song.title} by ${song.artist}`);
              }
              const spotifyData = await spotifyResponse.json();
              const image =
                spotifyData.tracks?.items?.[0]?.album?.images?.[0]?.url || song.image || "/placeholder.jpg";
              return { ...song, image };
            } catch (err) {
              console.error(`Spotify API Error for song ${song.title}:`, err);
              return { ...song, image: song.image || "/placeholder.jpg" };
            }
          })
        );

        // 4️⃣ Cache in MongoDB
        await TopSongsCache.updateOne(
          { cacheKey },
          { $set: { data: topSongsWithImages, createdAt: new Date() } },
          { upsert: true }
        );

        // 5️⃣ Return response
        res.setHeader("Cache-Control", "s-maxage=604800, stale-while-revalidate");
        return res.status(200).json(topSongsWithImages);
      } catch (error) {
        console.error("Error fetching chart data:", error.message);
        return res.status(500).json({ error: "Failed to fetch top songs" });
      }
    }

    else if (type === "trendingArtists") {

      try {
        const cacheKey = `trendingArtists`;
        // 2️⃣ Try Redis cache next
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log("redis cache hit for", cacheKey);
          res.setHeader(
            "Cache-Control",
            "public, s-maxage=604800, stale-while-revalidate"
          );
          return res.status(200).json(cached);
        }
        // Fetch trending artists from Last.fm
        const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=20`;
        const { response, data } = await fetchWithLastFmKeys(
          apiUrl,
          () => LAST_FM_API_KEY,
          () => LAST_FM_API_KEY2
        );

        if (!data.artists?.artist?.length) {
          return res.status(404).json({ error: "No trending artists found" });
        }

        // Fetch artist images from Spotify
        const accessToken = await getSpotifyAccessToken();
        const trendingArtists = await Promise.all(
          data.artists.artist.map(async (artist) => {
            try {
              const spotifyApiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                artist.name
              )}&type=artist&limit=1`;

              const spotifyResponse = await fetch(spotifyApiUrl, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });

              if (!spotifyResponse.ok) {
                throw new Error(`Failed to fetch Spotify data for artist ${artist.name}`);
              }

              const spotifyData = await spotifyResponse.json();
              const spotifyArtist = spotifyData.artists?.items?.[0];


              return {
                name: artist.name,
                url: artist.url,
                img: spotifyArtist?.images?.[0]?.url || "/placeholder.jpg",
              };
            } catch (err) {
              console.error(`Spotify API Error for artist ${artist.name}:`, err);
              return {
                name: artist.name,
                url: artist.url,
                img: "/placeholder.jpg",
              };
            }
          })
        );
        // Cache for 7 days
        await redis.set(cacheKey, JSON.stringify(trendingArtists), { ex: 604800 });


        res.setHeader("Cache-Control", "s-maxage=604800, stale-while-revalidate");
        return res.status(200).json(trendingArtists);
      } catch (err) {
        console.error("Last.fm API Error:", err);
        return res.status(500).json({ error: "Failed to fetch trending artists" });
      }
    }

    else if (type === "nigerianSongs") {
      try {
        const cacheKey = `nigerianSongs`;
        // 🔹 Check mongo cache first
        await connectDB();
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=604800, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }
        // Fetch Nigerian songs from Last.fm
        const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=nigeria&limit=20&api_key=${LAST_FM_API_KEY}&format=json`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch Nigerian songs from Last.fm");
        }
        const data = await response.json();

        if (!data.tracks?.track?.length) {
          return res.status(404).json({ error: "No Nigerian songs found" });
        }
        const nigerianSongs = data.tracks.track.map((track) => ({
          title: track.name,
          artist: track.artist.name,
          url: track.url,
        }));

        // get spotify images for each track
        const accessToken = await getArtistAccessToken();
        const nigerianSongsWithImages = await Promise.all(
          nigerianSongs.map(async (song) => {
            try {
              const spotifyApiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                `${song.artist} ${song.title}`
              )}&type=track&limit=1`;
              const spotifyResponse = await fetch(spotifyApiUrl, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (!spotifyResponse.ok) {
                throw new Error(`Failed to fetch Spotify data for ${song.title} by ${song.artist}`);
              }
              const spotifyData = await spotifyResponse.json();
              const image =
                spotifyData.tracks?.items?.[0]?.album?.images?.[0]?.url || "/placeholder.jpg";
              return { ...song, image };
            } catch (err) {
              console.error(`Spotify API Error for track ${song.title} by ${song.artist}:`, err);
              return { ...song, image: "/placeholder.jpg" };
            }
          })
        );

        // Cache in mongodb for 7days
        await SongCache.updateOne(
          { cacheKey },
          { $set: { data: nigerianSongsWithImages, createdAt: new Date() } },
          { upsert: true }
        );

        res.setHeader("Cache-Control", "s-maxage=604800, stale-while-revalidate");
        return res.status(200).json(nigerianSongsWithImages);
      } catch (err) {
        console.error("Last.fm API Error:", err);
        return res.status(500).json({ error: "Failed to fetch Nigerian songs" });
      }
    }

    else if (type === "playlist") {
      if (!playlistId) {
        return res.status(400).json({ error: "Missing playlist ID" });
      }
      if (!playlistType) {
        return res.status(400).json({ error: "Missing playlist type" });
      }
      if (playlistType !== "sp" && playlistType !== "dz") {
        return res.status(400).json({ error: "Invalid playlist type" });
      }

      if (playlistType === "sp") {
        // 1️⃣ Try MongoDB cache first
        await connectDB();
        const cacheKey = `spotifyPlaylist:${playlistId}`;
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=2592000, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }
        const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;
        const response = await fetchWithSpotifyTokens(
          apiUrl,
          getSpotifyAccessToken,
          getArtistAccessToken
        );

        if (!response.ok) {
          return res.status(500).json({ error: "Failed to fetch Spotify playlist details" });
        }

        const data = await response.json();
        if (!data.tracks?.items?.length) {
          return res.status(404).json({ error: "No tracks found in this playlist" });
        }

        const playlistDetails = {
          name: data.name,
          image: data.images[0]?.url || "/placeholder.jpg",
        };

        const tracks = data.tracks.items.map((item) => ({
          id: item.track.id,
          title: item.track.name,
          artist: { name: item.track.artists[0]?.name || "Unknown Artist" },
          album: { cover_medium: item.track.album.images[0]?.url || "/placeholder.jpg" },
        }));
        // Cache in mongodb for 30 days
        await SongCache.updateOne(
          { cacheKey },
          { $set: { data: { playlistDetails, tracks }, createdAt: new Date() } },
          { upsert: true }
        );
        res.setHeader("Cache-Control", "public, s-maxage=2592000, stale-while-revalidate");
        return res.status(200).json({ playlistDetails, tracks });
      }

      if (playlistType === "dz") {
        // 1️⃣ Try MongoDB cache first
        await connectDB();
        const cacheKey = `deezerPlaylist:${playlistId}`;
        const mongoCache = await SongCache.findOne({ cacheKey });
        if (mongoCache) {
          console.log("MongoDB cache hit for", cacheKey);
          res.setHeader("Cache-Control", "public, s-maxage=2592000, stale-while-revalidate");
          return res.status(200).json(mongoCache.data);
        }

        // Fetch Deezer playlist details
        const options = {
          method: "GET",
          url: `https://deezerdevs-deezer.p.rapidapi.com/playlist/${encodeURIComponent(
            playlistId
          )}`,
          headers: {
            "x-rapidapi-key": "67685ec1f0msh5feaa6bf64dbeadp16ffa5jsnd72b2a894302",
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
          },
        };

        try {
          const response = await axios.request(options);
          const data = response.data;

          const playlistDetails = {
            name: data.title,
            image: data.picture_medium,
          };

          const tracks = data.tracks.data.map((track) => ({
            id: track.id,
            title: track.title,
            artist: { name: track.artist.name },
            album: { cover_medium: track.album.cover_medium },
          }));
          // Cache in mongodb for 30 days
          await SongCache.updateOne(
            { cacheKey },
            { $set: { data: { playlistDetails, tracks }, createdAt: new Date() } },
            { upsert: true }
          );
          res.setHeader("Cache-Control", "public, s-maxage=2592000, stale-while-revalidate");
          return res.status(200).json({ playlistDetails, tracks });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Failed to fetch Deezer playlist details" });
        }
      }
    }

    else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}