import Contact from "../models/Contact.js";

import HttpError from "../helpers/HttpError.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 10, favorite } = req.query;
	const skip = (page - 1) * limit;
	const filter = {owner};
	if(favorite !== undefined) {
		filter.favorite = favorite;
	}

	const result = await Contact.find(filter, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email");
	res.json(result);
};

const getOneContact = async (req, res) => {
	const { id } = req.params;
	const {_id: owner} = req.user;
	// const result = await Contact.findById({_id: id, owner});
  const result = await Contact.findOne({_id: id, owner});
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`);
	}
	res.json(result);
};

const createContact = async (req, res) => {
	const {_id: owner} = req.user;
	const result = await Contact.create({...req.body, owner});

	res.status(201).json(result);
};

const updateContact = async (req, res) => {
	const { id } = req.params;
	const {_id: owner} = req.user;
	const result = await Contact.findOneAndUpdate({_id: id, owner}, req.body);
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`);
	}
	res.json(result);
};

const updateStatusContact = async (req, res) => {
	const { id } = req.params;
	const {_id: owner} = req.user;
	// const result = await Contact.findByIdAndUpdate(id, req.body);
	const result = await Contact.findOneAndUpdate({_id: id, owner}, req.body);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const deleteContact = async (req, res) => {
	const { id } = req.params;
	const {_id: owner} = req.user;
	const result = await Contact.findOneAndDelete({_id: id, owner});
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
