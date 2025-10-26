import express from "express";
import { getAllTracks, getTrack, createTrack, likeTrack } from "../controllers/trackController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllTracks);
router.get("/:id", protect, getTrack);
router.post("/", protect, createTrack);
router.post("/like/:id", protect, likeTrack);

export default router;
