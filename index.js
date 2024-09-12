import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";
import upload from "./upload.js";

// Get __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Allowing Credentials for Cross-Domain Requests
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

// Using JSON parsing
app.use(express.json());

// Setting up CORS to work with cookies
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? "https://react-ts-lama-social-network.onrender.com"
				: "http://localhost:3000",
		credentials: true,
	})
);

// Connecting cookie-parser
app.use(cookieParser());

// Multer upload
app.post("/api/upload", upload.single("file"), (req, res) => {
	try {
		res.status(200).json(req.file.filename);

	} catch (err) {
		res.status(400).json({ error: "No file uploaded" });
	}
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storyRoutes);

// Setting up React static file serving
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Setting up static distribution of uploaded files from the upload folder
// https://your-domain/upload/file_name
app.use('/upload', express.static(path.join(__dirname, 'client', 'public', 'upload')));

// For all other routes, we send index.html from build
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Server port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}!`);
});
