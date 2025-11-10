import express from "express";
import { getAllAlbums, getAlbum, createAlbum, followAlbum } from "../controllers/albumController.js";
import { protect } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", protect, getAllAlbums);
router.get("/:id", protect, validateObjectId, getAlbum);
router.post("/", protect, createAlbum);
router.post("/follow/:id", protect, followAlbum);

export default router;
