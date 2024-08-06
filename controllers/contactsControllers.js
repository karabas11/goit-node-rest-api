import Contact from "../models/Contact.js";

import HttpError from "../helpers/HttpError.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
	const result = await Contact.find();
	res.json(result);
};

const getOneContact = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findById(id);
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`);
	}
	res.json(result);
};

const createContact = async (req, res) => {
	const result = await Contact.create(req.body);

	res.status(201).json(result);
};

const updateContact = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body);
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`);
	}
	res.json(result);
};

const updateStatusContact = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const deleteContact = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndDelete(id);
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`);
	}
	// res.status(204).send;
	// res.json({
	// 	message: "Delete success",
	// });
	res.json(result);
};

export default {
	getAllContacts: ctrlWrapper(getAllContacts),
	getOneContact: ctrlWrapper(getOneContact),
	deleteContact: ctrlWrapper(deleteContact),
	createContact: ctrlWrapper(createContact),
	updateContact: ctrlWrapper(updateContact),
	updateStatusContact: ctrlWrapper(updateStatusContact),
};
