import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import {Jimp} from "jimp";

import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, "Email already in use");
	}
	const hashPassword = await bcrypt.hash(password, 10);
	const avatarUrl = gravatar.url(email);
	const newUser = await User.create({ ...req.body, password: hashPassword, avatarUrl });

	res.status(201).json({
		email: newUser.email,
		subscription: "starter",
	});
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password is wrong");
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

	
	res.status(200).json({
		token,
		user: {
			email,
			subscription: user.subscription,
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

const updateAvatar = async (req, res) => {
	const { _id } = req.user;

	const { path: oldPath, originalname } = req.file;

	const image = await Jimp.read(oldPath);
	image.resize(250, 250);
	//image.greyscale();
	await image.write(oldPath);

	const filename = `${_id}_${originalname}`;
	const newPath = path.join(avatarsPath, filename);


	await fs.rename(oldPath, newPath);

	const avatarUrl = path.join( "avatars", filename);

	await User.findByIdAndUpdate(_id, { avatarUrl });

	res.status(200).json({
		avatarUrl,
	});
};

export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
	getCurrent: ctrlWrapper(getCurrent),
	signout: ctrlWrapper(signout),
	updateStatusUser: ctrlWrapper(updateStatusUser),
	updateAvatar: ctrlWrapper(updateAvatar),
};
