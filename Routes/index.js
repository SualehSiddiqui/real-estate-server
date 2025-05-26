import express from "express";
import auth from "./auth.js";
import property from "./property.js";
import verifyToken from "../middleware/verifyToken.js";

const Router = express.Router();

Router.use('/auth', auth);
Router.use('/property', property);

export default Router;