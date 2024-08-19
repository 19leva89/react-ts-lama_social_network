import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getLikes = async (req, res) => {
	try {
		const postId = parseInt(req.query.postId, 10);

		// Get all likes for the given post
		const likes = await prisma.likes.findMany({
			where: {
				postId: postId,
			},
			select: {
				userId: true,
			},
		});

		// Return only the array of userId
		res.status(200).json(likes.map(like => like.userId));
	} catch (err) {
		res.status(500).json(err.message);
	}
};

export const addLike = async (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in!");

	try {
		// Verify the token
		const userInfo = jwt.verify(token, "secretkey");

		// Add a like
		const like = await prisma.likes.create({
			data: {
				userId: userInfo.id,
				postId: req.body.postId,
			},
		});

		res.status(200).json("Post has been liked.");
	} catch (err) {
		// Error handling
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		res.status(500).json(err.message);
	}
};

export const deleteLike = async (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in!");

	try {
		// Verify the token
		const userInfo = jwt.verify(token, "secretkey");

		// Remove like
		const like = await prisma.likes.deleteMany({
			where: {
				userId: userInfo.id,
				postId: Number(req.query.postId),
			},
		});

		if (like.count > 0) {
			return res.status(200).json("Post has been disliked.");
		} else {
			return res.status(404).json("Like not found.");
		}
	} catch (err) {
		// Error handling
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		res.status(500).json(err.message);
	}
};