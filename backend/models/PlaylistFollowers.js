import mongoose from "mongoose";

const playlistFollowersSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
}, { timestamps: true });

const PlaylistFollowers = mongoose.models.PlaylistFollowers || mongoose.model("PlaylistFollowers", playlistFollowersSchema);

export default PlaylistFollowers;
