import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import moment from "moment";

const prisma = new PrismaClient();

export const getStories = async (req, res) => {
	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not logged in!");

	try {
		const userInfo = jwt.verify(token, "secretkey");

		console.log("server story userId:", userInfo.id);

		// Fetch stories with user information
		const stories = await prisma.stories.findMany({
			where: {
				userId: {
					in: [
						// Stories of followed users
						...await prisma.relationships.findMany({
							where: { followerUserId: userInfo.id },
							select: { followedUserId: true }
						}).then(relations => relations.map(rel => rel.followedUserId)),
						userInfo.id // Include the current user's stories
					]
				}
			},
			include: {
				user: {
					select: {
						name: true // Select only the name
					}
				}
			},
			take: 4 // Limit the number of stories
		});

		// Transform the stories to include user name at the root level
		const transformedStories = stories.map(story => ({
			id: story.id,
			img: story.img,
			name: story.user.name,
			userId: story.userId
		}));

		return res.status(200).json(transformedStories);
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		return res.status(500).json(err.message);
	}
};

export const addStory = async (req, res) => {
	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not logged in!");

	try {
		const userInfo = jwt.verify(token, "secretkey");

		const newStory = await prisma.stories.create({
			data: {
				img: req.body.img,
				createdAt: moment(Date.now()).toDate(),
				userId: userInfo.id
			}
		});

		return res.status(200).json({ message: "Story has been created.", story: newStory });
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		return res.status(500).json(err.message);
	}
};

export const deleteStory = async (req, res) => {
	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not logged in!");

	try {
		const userInfo = jwt.verify(token, "secretkey");

		// Find the story to ensure it exists and is owned by the user
		const story = await prisma.stories.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		});

		if (!story) {
			return res.status(404).json("Story not found.");
		}

		if (story.userId !== userInfo.id) {
			return res.status(403).json("You can delete only your story!");
		}

		await prisma.stories.delete({
			where: {
				id: parseInt(req.params.id)
			}
		});

		return res.status(200).json("Story has been deleted.");
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		return res.status(500).json(err.message);
	}
};
