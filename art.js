import axios from "axios";
import * as cheerio from "cheerio";

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


(async () => {
  const result = await getLyrics("Adele", "Hello");
  console.log(result);
})();