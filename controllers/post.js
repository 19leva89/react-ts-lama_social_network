import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import moment from "moment";

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
	const userId = req.query.userId;
	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not logged in!");

	try {
		const userInfo = jwt.verify(token, "secretkey");

		let posts;
		if (userId !== "undefined" && userId !== undefined) {
			// Get posts for a specific user
			posts = await prisma.posts.findMany({
				where: {
					userId: Number(userId),
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							profilePicture: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
		} else {
			// Get posts for followed users and self
			posts = await prisma.posts.findMany({
				where: {
					OR: [
						{
							userId: userInfo.id,
						},
						{
							user: {
								followers: {
									some: {
										followerUserId: userInfo.id,
									},
								},
							},
						},
					],
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							profilePicture: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
		}

		// Transform posts to match the required format
		const formattedPosts = posts.map(post => ({
			id: post.id,
			description: post.description,
			img: post.img,
			createdAt: post.createdAt,
			userId: post.userId,
			name: post.user.name,
			profilePicture: post.user.profilePicture,
		}));

		return res.status(200).json(formattedPosts);
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		res.status(500).json(err.message);
	}
};

export const addPost = async (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in!");

	try {
		// Verify the token and extract user information
		const userInfo = jwt.verify(token, "secretkey");

		// Create a new post
		await prisma.posts.create({
			data: {
				description: req.body.description,
				img: req.body.img,
				createdAt: moment(Date.now()).toDate(),
				userId: userInfo.id,
			},
		});

		return res.status(200).json("Post has been created.");
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		return res.status(500).json(err.message);
	}
};

export const deletePost = async (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in!");

	try {
		// Verify the token and extract user information
		const userInfo = jwt.verify(token, "secretkey");

		// Delete a post
		const result = await prisma.posts.deleteMany({
			where: {
				id: parseInt(req.params.id),
				userId: userInfo.id,
			},
		});

		if (result.count > 0) {
			return res.status(200).json("Post has been deleted.");
		} else {
			return res.status(403).json("You can delete only your post.");
		}
	} catch (err) {
		if (err.name === 'JsonWebTokenError') {
			return res.status(403).json("Token is not valid!");
		}
		return res.status(500).json(err.message);
	}
};
