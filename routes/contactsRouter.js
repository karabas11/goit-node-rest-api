import express from "express";
import contactsControlles from "../controllers/contactsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControlles.getAllContacts);

contactsRouter.get("/:id", contactsControlles.getOneContact);

contactsRouter.delete("/:id", contactsControlles.deleteContact);

contactsRouter.post("/", isEmptyBody, validateBody(createContactSchema), contactsControlles.createContact);

contactsRouter.put("/:id", isEmptyBody, validateBody(updateContactSchema), contactsControlles.updateContact);

export default contactsRouter;
