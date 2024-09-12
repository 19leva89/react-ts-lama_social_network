import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req, res) => {
	try {
		// CHECK IF USER EXISTS
		const existingUser = await prisma.users.findFirst({
			where: {
				username: req.body.username,
			},
		});

		if (existingUser) {
			return res.status(409).json("User already exists!");
		}

		// Hash the password
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(req.body.password, salt);

		// CREATE A NEW USER
		const newUser = await prisma.users.create({
			data: {
				username: req.body.username,
				email: req.body.email,
				password: hashedPassword,
				name: req.body.name,
			},
		});

		return res.status(200).json("User has been created.");
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

export const login = async (req, res) => {
	try {
		// Check if the user exists
		const user = await prisma.users.findFirst({
			where: {
				username: req.body.username,
			},
		});

		if (!user) {
			return res.status(404).json("User not found!");
		}

		// Password verification
		const checkPassword = bcrypt.compareSync(req.body.password, user.password);

		if (!checkPassword) {
			return res.status(400).json("Wrong password or username!");
		}

		// Token generation
		const token = jwt.sign({ id: user.id }, "secretkey");

		// Excluding the password from the response
		const { password, ...others } = user;

		// Setting the token in a cookie and returning user information
		res
			.cookie("accessToken", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: 'Lax'
			})
			.status(200)
			.json(others);
	} catch (err) {
		return res.status(500).json(err.message);
	}
};

export const logout = (req, res) => {
	res.clearCookie("accessToken", {
		secure: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: 'Lax',
	}).status(200).json("User has been logged out.")
};
