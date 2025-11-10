import User from "../models/User.js";
import UserFollowers from "../models/UserFollowers.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const { id } = req.params; // user to follow
    const follow = await UserFollowers.create({ follower_id: req.user.id, followed_id: id });
    res.json(follow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};