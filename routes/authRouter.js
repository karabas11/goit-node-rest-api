import express from "express";
import authControllers from "../controllers/authControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../middlewares/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import { userSignupShema, userSigninShema } from "../models/User.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userSignupShema), authControllers.signup);

authRouter.post("/login", isEmptyBody, validateBody(userSigninShema), authControllers.signin);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signout);

authRouter.patch("/:id/subscription", authenticate, authControllers.updateStatusUser);

export default authRouter;
