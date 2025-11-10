import Track from "../models/Track.js";
import Likes from "../models/Likes.js";

export const getAllTracks = async (req, res) => {
  try {
    res.json(await Track.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrack = async (req, res) => {
  try {
    res.json(await Track.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTrack = async (req, res) => {
  try {
    const track = await Track.create(req.body);
    res.status(201).json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeTrack = async (req, res) => {
  try {
    const like = await Likes.create({ user_id: req.user.id, track_id: req.params.id });
    res.json(like);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};