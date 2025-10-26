import Artist from "../models/Artist.js";
import ArtistFollowers from "../models/ArtistFollowers.js";

export const getAllArtists = async (req, res) => {
  const artists = await Artist.find();
  res.json(artists);
};

export const getArtist = async (req, res) => {
  const artist = await Artist.findById(req.params.id);
  res.json(artist);
};

export const followArtist = async (req, res) => {
  const { id } = req.params;
  const user_id = req.body.user_id;
  const follow = await ArtistFollowers.create({ user_id, artist_id: id });
  res.json(follow);
};
