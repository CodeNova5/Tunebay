import mongoose from "mongoose";

// Song cache: 90 days TTL
const SongCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 } // 90 days
});

// Artist albums cache: 7 days TTL
const ArtistAlbumsCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 } // 7 days
});

// Artist songs cache: 7 days TTL
const ArtistSongsCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 } // 7 days
});

const topSongsCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 } // 7 days
});


// Prevent model overwrite issues in dev
const SongCache = mongoose.models.SongCache || mongoose.model("SongCache", SongCacheSchema);
const ArtistAlbumsCache = mongoose.models.ArtistAlbumsCache || mongoose.model("ArtistAlbumsCache", ArtistAlbumsCacheSchema);
const ArtistSongsCache = mongoose.models.ArtistSongsCache || mongoose.model("ArtistSongsCache", ArtistSongsCacheSchema);
const TopSongsCache = mongoose.models.TopSongsCache || mongoose.model("TopSongsCache", topSongsCacheSchema);
export { SongCache, ArtistAlbumsCache, ArtistSongsCache, TopSongsCache };
