import Artist from "../models/Artist.js";
import ArtistFollowers from "../models/ArtistFollowers.js";

export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const followArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const follow = await ArtistFollowers.create({ user_id: req.user.id, artist_id: id });
    res.json(follow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};