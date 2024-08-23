import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
	const { email, password, subscription } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email already in use");
	}
	const hashPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({ ...req.body, password: hashPassword });

	res.status(201).json({
		email: newUser.email,
		subscription: "starter",
	});
};

const signin = async (req, res) => {
	const { email, password, subscription } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401);
	}
	const passwwordCompare = await bcrypt.compare(password, user.password);
	if (!passwwordCompare) {
		throw HttpError(401, "Email or password is wrong");
	}

	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token,
		user: {
			email,
			subscription: "starter",
		},
	});
};

const getCurrent = async (req, res) => {
	const { email, subscription } = req.body;

	res.json({
		email,
		subscription,
	});
};

const signout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });
	res.status(204).json({
		message: "No Content",
	});
	// res.status(204, "No Content")
};

const updateStatusUser = async (req, res) => {
	const { _id } = req.user;
	const result = await User.findByIdAndUpdate(_id, req.body);
	if (!result) {
		throw HttpError(404, "Not found");
	}
	res.json(result);
};

export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
	getCurrent: ctrlWrapper(getCurrent),
	signout: ctrlWrapper(signout),
	updateStatusUser: ctrlWrapper(updateStatusUser),
};
