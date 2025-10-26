import mongoose from "mongoose";

const playlistTrackSchema = new mongoose.Schema({
  playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
  track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
  order_index: Number,
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  added_at: { type: Date, default: Date.now },
});

const PlaylistTrack = mongoose.models.PlaylistTrack || mongoose.model("PlaylistTrack", playlistTrackSchema);

export default PlaylistTrack;
