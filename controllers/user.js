import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
	const userId = parseInt(req.params.userId);

	try {
		// Get user by userId
		const user = await prisma.users.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) {
			return res.status(404).json("User not found.");
		}

		// Exclude password field from the response
		const { password, ...info } = user;

		return res.json(info);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

export const updateUser = async (req, res) => {
	const token = req.cookies.accessToken;

	if (!token) {
		return res.status(401).json("Not authenticated!");
	}

	jwt.verify(token, "secretkey", async (err, userInfo) => {
		if (err) {
			return res.status(403).json("Token is not valid!");
		}

		const userId = userInfo.id;

		try {
			// Update user in the database
			const updatedUser = await prisma.users.update({
				where: {
					id: userId
				},
				data: {
					name: req.body.name,
					city: req.body.city,
					website: req.body.website,
					profilePicture: req.body.profilePicture,
					coverPicture: req.body.coverPicture
				}
			});

			// Check if any changes were made
			if (updatedUser) {
				return res.json("Updated!");
			} else {
				return res.status(403).json("You can update only your user!");
			}
		} catch (err) {
			return res.status(500).json(err.message);
		}
	});
};