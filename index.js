import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";

import upload from "./upload.js";

const app = express();

// middlewares
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", true);
	next();
});
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000" || "https://react-ts-lama-social-network.netlify.app",
	})
);
app.use(cookieParser());

// multer upload
app.post("/api/upload", upload.single("file"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}
	const file = req.file;
	res.status(200).json(file.filename);
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storyRoutes);

// server port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`API working on port ${PORT}!`);
});
