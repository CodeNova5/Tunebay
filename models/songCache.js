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

const topArtistsCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 } // 7 days
});

// User detail including notification token no expiry
const UserDetailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: false }, 
  notificationToken: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model overwrite issues in dev
const SongCache = mongoose.models.SongCache || mongoose.model("SongCache", SongCacheSchema);
const ArtistAlbumsCache = mongoose.models.ArtistAlbumsCache || mongoose.model("ArtistAlbumsCache", ArtistAlbumsCacheSchema);
const ArtistSongsCache = mongoose.models.ArtistSongsCache || mongoose.model("ArtistSongsCache", ArtistSongsCacheSchema);
const TopSongsCache = mongoose.models.TopSongsCache || mongoose.model("TopSongsCache", topSongsCacheSchema);
const TopArtistsCache = mongoose.models.TopArtistsCache || mongoose.model("TopArtistsCache", topArtistsCacheSchema);
const UserDetail = mongoose.models.UserDetail || mongoose.model("UserDetail", UserDetailSchema);
export { SongCache, ArtistAlbumsCache, ArtistSongsCache, TopSongsCache, TopArtistsCache, UserDetail };
