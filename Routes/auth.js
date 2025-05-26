import express from "express";
import {
    signin,
    login,
    forgetUserPassword,
    resetUserPasswordUi,
    resetUserPassword,
    // updateUserInfo,
} from "../controllers/auth/index.js";
import verifyToken from "../middleware/verifyToken.js";

const Router = express.Router();

Router.post('/signin', signin);
Router.post('/login', login);
Router.post("/forgetPassword", forgetUserPassword)
Router.post("/resetPassword/:id/:token", resetUserPassword)
Router.get("/resetPassword/:id/:token", resetUserPasswordUi)
// Router.post("/updateUser/:id/:password", verifyToken, updateUserInfo)

export default Router;