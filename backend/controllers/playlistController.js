import Playlist from "../models/Playlist.js";
import PlaylistTrack from "../models/PlaylistTrack.js";
import PlaylistFollowers from "../models/PlaylistFollowers.js";

export const getAllPlaylists = async (req, res) => {
  try {
    res.json(await Playlist.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlaylist = async (req, res) => {
  try {
    res.json(await Playlist.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.create(req.body);
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const followPlaylist = async (req, res) => {
  try {
    const follow = await PlaylistFollowers.create({ user_id: req.user.id, playlist_id: req.params.id });
    res.json(follow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTrack = async (req, res) => {
  try {
    const track = await PlaylistTrack.create({ playlist_id: req.params.id, ...req.body });
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};