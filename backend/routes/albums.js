import express from "express";
import { getAllAlbums, getAlbum, createAlbum, followAlbum } from "../controllers/albumController.js";

const router = express.Router();

router.get("/", protect, getAllAlbums);
router.get("/:id", protect, getAlbum);
router.post("/", protect, createAlbum);
router.post("/follow/:id", protect, followAlbum);

export default router;
