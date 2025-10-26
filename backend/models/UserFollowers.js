import mongoose from "mongoose";

const userFollowersSchema = new mongoose.Schema({
  follower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  followed_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const UserFollowers = mongoose.models.UserFollowers || mongoose.model("UserFollowers", userFollowersSchema);

export default UserFollowers;
