import Album from "../models/Album.js";
import AlbumFollowers from "../models/AlbumFollowers.js";

export const getAllAlbums = async (req, res) => res.json(await Album.find());
export const getAlbum = async (req, res) => res.json(await Album.findById(req.params.id));

export const createAlbum = async (req, res) => {
  const album = await Album.create(req.body);
  res.status(201).json(album);
};

export const followAlbum = async (req, res) => {
  const follow = await AlbumFollowers.create({ user_id: req.body.user_id, album_id: req.params.id });
  res.json(follow);
};
