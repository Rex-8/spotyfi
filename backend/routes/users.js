import express from "express";
import { getUser, getAllUsers, followUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/:id", protect, validateObjectId, getUser);
router.post("/follow/:id", protect, followUser);

export default router;
