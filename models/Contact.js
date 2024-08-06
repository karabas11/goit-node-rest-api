import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, preUpdate } from "./hooks.js";

const contactShema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true },
);

contactShema.post("save", handleSaveError);

contactShema.pre("findOneAndUpdate", preUpdate);

contactShema.post("findOneAndUpdate", handleSaveError);

export const createContactSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string(),
	phone: Joi.string(),
	favorite: Joi.boolean(),
});

export const updateFavoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactShema);

export default Contact;
