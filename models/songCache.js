import mongoose from "mongoose";

const SongCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 } // 90 days TTL
});

// Prevent model overwrite issues in dev
export default mongoose.models.SongCache || mongoose.model("SongCache", SongCacheSchema);
