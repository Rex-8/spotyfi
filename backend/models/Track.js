import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  album_id: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  audio_file_url: String,
  duration: Number,
  cover_art_url: String,
  release_date: Date,
}, { timestamps: true });

const Track = mongoose.models.Track || mongoose.model("Track", trackSchema);

export default Track;
