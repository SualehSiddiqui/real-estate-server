import express from "express";
import {
    signin,
    login,
    forgetUserPassword,
    resetUserPasswordUi,
    resetUserPassword,
    updateUserInfo,
    getSingleUser,
    getMessage,
    postMessage,
    markAsReadThisMessage,
    deleteThisMessage,
} from "../controllers/auth/index.js";
import verifyToken from "../middleware/verifyToken.js";

const Router = express.Router();

Router.post('/signin', signin);
Router.post('/login', login);
Router.post("/forgetPassword", forgetUserPassword)
Router.post("/resetPassword/:id/:token", resetUserPassword)
Router.get("/resetPassword/:id/:token", resetUserPasswordUi)
Router.post("/update/:id/:password", verifyToken, updateUserInfo)
Router.get("/user/:id", getSingleUser)
Router.get('/message/:userId/:page/:size', getMessage);
Router.post('/message/:userId', postMessage);
Router.get('/readMessage/:userId/:messageId', markAsReadThisMessage);
Router.delete('/deleteMessage/:userId/:messageId', deleteThisMessage);

export default Router;