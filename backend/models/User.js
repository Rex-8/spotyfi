import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  display_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  is_artist: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
