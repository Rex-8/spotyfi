import express from "express";
import { getUser, getAllUsers, followUser } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUser);
router.post("/follow/:id", protect, followUser);

export default router;
