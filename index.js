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
				? "https://react-ts-lama-social-network.netlify.app"
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

// Server port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`API working on port ${PORT}!`);
});
