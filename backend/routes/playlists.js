import express from "express";
import { getAllPlaylists, getPlaylist, createPlaylist, followPlaylist, addTrack } from "../controllers/playlistController.js";

const router = express.Router();

router.get("/", protect, getAllPlaylists);
router.get("/:id", protect, getPlaylist);
router.post("/", protect, createPlaylist);
router.post("/follow/:id", protect, followPlaylist);
router.post("/track/:id", protect, addTrack);

export default router;
