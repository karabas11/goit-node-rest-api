import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, preUpdate } from "./hooks.js";

const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
	{
		password: {
			type: String,
			minLength: 6,
			required: [true, "Password is required"],
		},
		email: {
			type: String,
			match: mailformat,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: true },
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", preUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupShema = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().pattern(mailformat).required(),
	subscription: Joi.string().valid("starter", "pro", "business"),
});

export const userSigninShema = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().pattern(mailformat).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const User = model("user", userSchema);

export default User;
