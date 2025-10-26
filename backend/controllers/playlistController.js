import Playlist from "../models/Playlist.js";
import PlaylistTrack from "../models/PlaylistTrack.js";
import PlaylistFollowers from "../models/PlaylistFollowers.js";

export const getAllPlaylists = async (req, res) => res.json(await Playlist.find());
export const getPlaylist = async (req, res) => res.json(await Playlist.findById(req.params.id));

export const createPlaylist = async (req, res) => {
  const playlist = await Playlist.create(req.body);
  res.status(201).json(playlist);
};

export const followPlaylist = async (req, res) => {
  const follow = await PlaylistFollowers.create({ user_id: req.body.user_id, playlist_id: req.params.id });
  res.json(follow);
};

export const addTrack = async (req, res) => {
  const track = await PlaylistTrack.create({ playlist_id: req.params.id, ...req.body });
  res.json(track);
};
