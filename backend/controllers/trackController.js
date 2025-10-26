import Track from "../models/Track.js";
import Likes from "../models/Likes.js";

export const getAllTracks = async (req, res) => res.json(await Track.find());
export const getTrack = async (req, res) => res.json(await Track.findById(req.params.id));

export const createTrack = async (req, res) => {
  const track = await Track.create(req.body);
  res.status(201).json(track);
};

export const likeTrack = async (req, res) => {
  const like = await Likes.create({ user_id: req.body.user_id, track_id: req.params.id });
  res.json(like);
};
