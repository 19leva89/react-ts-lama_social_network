import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getRelationships = async (req, res) => {
	const followedUserId = parseInt(req.query.followedUserId, 10);
	if (isNaN(followedUserId)) {
		return res.status(400).json("Invalid user ID");
	}

	try {
		const relationships = await prisma.relationships.findMany({
			where: {
				followedUserId: followedUserId
			},
			select: {
				followerUserId: true
			}
		});

		// Extract and send the array of followerUserIds
		const followerUserIds = relationships.map(relationship => relationship.followerUserId);

		return res.status(200).json(followerUserIds);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

export const addRelationship = async (req, res) => {
	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not logged in!");

	try {
		const userInfo = jwt.verify(token, "secretkey");

		const { userId } = req.body;

		// Ensure userId is valid
		if (!userId) {
			return res.status(400).json("Invalid user ID");
		}

		// Create new relationship
		await prisma.relationships.create({
			data: {
				followerUserId: userInfo.id,
				followedUserId: userId
			}
		});

		return res.status(200).json("Following");
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		return res.status(500).json(err.message);
	}
};

export const deleteRelationship = async (req, res) => {
	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not logged in!");

	try {
		const userInfo = jwt.verify(token, "secretkey");

		const { userId } = req.query;

		// Ensure userId is valid
		if (!userId) {
			return res.status(400).json("Invalid user ID");
		}

		// Delete relationship
		await prisma.relationships.deleteMany({
			where: {
				followerUserId: userInfo.id,
				followedUserId: parseInt(userId, 10),
			}
		});

		return res.status(200).json("Unfollow");
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		return res.status(500).json(err.message);
	}
};