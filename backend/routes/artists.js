import express from "express";
import { getArtist, getAllArtists, followArtist } from "../controllers/artistController.js";
import { protect } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", protect, getAllArtists);
router.get("/:id", protect, validateObjectId, getArtist);
router.post("/follow/:id", protect, followArtist);

export default router;
