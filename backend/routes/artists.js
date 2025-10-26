import express from "express";
import { getArtist, getAllArtists, followArtist } from "../controllers/artistController.js";

const router = express.Router();

router.get("/", protect, getAllArtists);
router.get("/:id", protect, getArtist);
router.post("/follow/:id", protect, followArtist);

export default router;
