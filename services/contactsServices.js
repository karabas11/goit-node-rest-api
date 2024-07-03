import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");
const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const ListContacts = async () => {
	const result = await fs.readFile(contactsPath, "utf-8");
	return JSON.parse(result);
};

export const getContactById = async id => {
	const contacts = await ListContacts();
	const result = contacts.find(item => item.id === id);
	return result || null;
};

export const removeContact = async id => {
	const contacts = await ListContacts();
	const index = contacts.findIndex(item => item.id === id);
	if (index === -1) {
		return null;
	}
	const [result] = contacts.splice(index, 1);
	await updateContacts(contacts);
	return result;
};

export const addContact = async ({ name, email, phone }) => {
	const contacts = await ListContacts();
	const newContact = {
		id: nanoid(),
		name,
		email,
		phone,
	};
	contacts.push(newContact);
	await updateContacts(contacts);
	return newContact;
};

export const updateById = async (id, data) => {
	const contacts = await ListContacts();
	const index = contacts.findIndex(item => item.id === id);
	if (index === -1) {
		return null;
	}
	contacts[index] = { ...contacts[index], ...data };
	await updateContacts(contacts);
	return contacts[index];
};
