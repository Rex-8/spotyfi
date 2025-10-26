import User from "../models/User.js";
import UserFollowers from "../models/UserFollowers.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

export const followUser = async (req, res) => {
  const { id } = req.params; // user to follow
  const follower_id = req.body.follower_id; 
  const follow = await UserFollowers.create({ follower_id, followed_id: id });
  res.json(follow);
};
