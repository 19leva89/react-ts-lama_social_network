import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import moment from "moment";

const prisma = new PrismaClient();

export const getComments = async (req, res) => {
	try {
		const comments = await prisma.comments.findMany({
			where: {
				postId: parseInt(req.query.postId),
			},
			orderBy: {
				createdAt: 'desc',
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
		});

		// Transforming data before sending
		const formattedComments = comments.map(comment => ({
			id: comment.id,
			description: comment.description,
			createdAt: comment.createdAt,
			postId: comment.postId,
			userId: comment.userId,
			name: comment.user.name,
			profilePicture: comment.user.profilePicture
		}));

		res.status(200).json(formattedComments);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

export const addComment = async (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not logged in!");

	jwt.verify(token, "secretkey", async (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");

		try {
			const newComment = await prisma.comments.create({
				data: {
					description: req.body.description,
					createdAt: moment(Date.now()).toDate(),
					userId: userInfo.id,
					postId: req.body.postId
				}
			});

			res.status(200).json("Comment has been created.");
		} catch (err) {
			res.status(500).json(err.message);
		}
	});
};

export const deleteComment = async (req, res) => {
	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", async (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");

		const commentId = parseInt(req.params.id, 10);

		try {
			// Check if the comment exists and if it belongs to the current user
			const comment = await prisma.comments.findUnique({
				where: { id: commentId },
			});

			if (!comment) {
				return res.status(404).json("Comment not found!");
			}

			if (comment.userId !== userInfo.id) {
				return res.status(403).json("You can delete only your comment!");
			}

			// Delete the comment
			await prisma.comments.delete({
				where: { id: commentId },
			});

			res.json("Comment has been deleted!");
		} catch (err) {
			res.status(500).json(err.message);
		}
	});
};