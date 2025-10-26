import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  is_public: { type: Boolean, default: true },
  cover_image_url: String,
  description: String,
}, { timestamps: true });

export default mongoose.model("Playlist", playlistSchema);
