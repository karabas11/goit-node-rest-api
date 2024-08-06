import express from "express";
import contactsControlles from "../controllers/contactsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidId from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../models/Contact.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControlles.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControlles.getOneContact);

contactsRouter.post("/", isEmptyBody, validateBody(createContactSchema), contactsControlles.createContact);

contactsRouter.put("/:id", isValidId, isEmptyBody, validateBody(updateContactSchema), contactsControlles.updateContact);

contactsRouter.patch(
	"/:id/favorite",
	isValidId,
	isEmptyBody,
	validateBody(updateFavoriteSchema),
	contactsControlles.updateStatusContact,
);

contactsRouter.delete("/:id", isValidId, contactsControlles.deleteContact);

export default contactsRouter;
