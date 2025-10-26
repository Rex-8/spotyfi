import mongoose from "mongoose";

const playlistFollowersSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
}, { timestamps: true });

export default mongoose.model("PlaylistFollowers", playlistFollowersSchema);
