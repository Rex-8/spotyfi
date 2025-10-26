import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  cover_art_url: String,
  release_date: Date,
}, { timestamps: true });

export default mongoose.model("Album", albumSchema);
