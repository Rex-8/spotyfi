import mongoose from "mongoose";

const albumFollowersSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  album_id: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
  followed_at: { type: Date, default: Date.now },
});

const AlbumFollowers = mongoose.models.AlbumFollowers || mongoose.model("AlbumFollowers", albumFollowersSchema);

export default AlbumFollowers;