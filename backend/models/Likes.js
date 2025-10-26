import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  track_id: { type: mongoose.Schema.Types.ObjectId, ref: "Track", required: true },
  liked_at: { type: Date, default: Date.now },
});

export default mongoose.model("Likes", likesSchema);
