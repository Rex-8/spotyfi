import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bio: String,
  genre: String,
  social_links: [String],
  artist_picture: String,
}, { timestamps: true });

export default mongoose.model("Artist", artistSchema);
