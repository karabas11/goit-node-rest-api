import { ListContacts, getContactById, addContact, updateById, removeContact } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllContacts = async (req, res) => {
	const result = await ListContacts();
	res.json(result);
};

const getOneContact = async (req, res) => {
	const { id } = req.params;
	const result = await getContactById(id);
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`);
	}
	res.json(result);
};

const deleteContact = async (req, res) => {
	const { id } = req.params;
	const result = await removeContact(id);
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`);
	}
	// res.status(204).send;
	res.json({
		message: "Delete success",
	});
};

const createContact = async (req, res) => {
	const result = await addContact(req.body);

	res.status(201).json(result);
};

const updateContact = async (req, res) => {
	const { id } = req.params;
	const result = await updateById(id, req.body);
	if (!result) {
		throw HttpError(404, `Contact with id=${id} not found`);
	}
	res.json(result);
};

export default {
	getAllContacts: ctrlWrapper(getAllContacts),
	getOneContact: ctrlWrapper(getOneContact),
	deleteContact: ctrlWrapper(deleteContact),
	createContact: ctrlWrapper(createContact),
	updateContact: ctrlWrapper(updateContact),
};
