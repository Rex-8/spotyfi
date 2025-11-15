import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import artistRoutes from "./routes/artists.js";
import trackRoutes from "./routes/tracks.js";
import albumRoutes from "./routes/albums.js";
import playlistRoutes from "./routes/playlists.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Serve static files from 'public' directory
// Music files: http://localhost:5000/Music/TRAPSOUL/song.mp3
// Images: http://localhost:5000/images/cover.jpg
// Audio: http://localhost:5000/audio/song.mp3
app.use('/Music', express.static(path.join(__dirname, 'public/Music')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

// Routes
app.get("/", (req, res) => res.send("MERN Music App Backend Running"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/playlists", playlistRoutes);

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));