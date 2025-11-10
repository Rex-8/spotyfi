import Album from "../models/Album.js";
import AlbumFollowers from "../models/AlbumFollowers.js";

export const getAllAlbums = async (req, res) => {
  try {
    res.json(await Album.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAlbum = async (req, res) => {
  try {
    res.json(await Album.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAlbum = async (req, res) => {
  try {
    const album = await Album.create(req.body);
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const followAlbum = async (req, res) => {
  try {
    const follow = await AlbumFollowers.create({ user_id: req.user.id, album_id: req.params.id });
    res.json(follow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};