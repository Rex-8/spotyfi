import mongoose from "mongoose";

const artistFollowersSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  artist_id: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
}, { timestamps: true });

const ArtistFollowers = mongoose.models.ArtistFollowers || mongoose.model("ArtistFollowers", artistFollowersSchema);

export default ArtistFollowers;