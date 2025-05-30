import {
    createUser,
    validateUser,
    forgetPassword,
    resetPasswordUi,
    resetPassword,
    updateUser,
    getOneUser,
    getUsersMessage,
    messageAboutProperty,
    markAsRead,
    deleteMessage,
} from "../../service/index.js";

const signin = (req, res) => {
    const user = req.body;
    createUser(user, res);
}

const login = (req, res) => {
    const user = req.body;
    validateUser(user, res);
}

const forgetUserPassword = async (req, res) => {
    const { email } = req.body
    return forgetPassword(email, res)
}

const resetUserPasswordUi = async (req, res) => {
    const { id, token } = req.params;
    return resetPasswordUi(id, token, res)
}

const resetUserPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    return resetPassword(id, token, password, res)
}

const updateUserInfo = async (req, res) => {
    const { id, password } = req.params;
    const userObj = req.body;
    return updateUser(id, password, userObj, res)
}

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    return getOneUser(id, res)
}

const getMessage = async (req, res) => {
    const { userId, page, size } = req.params;
    return getUsersMessage(userId, page, size, res)
}

const postMessage = async (req, res) => {
    const { userId } = req.params;
    const messageObj = req.body;
    return messageAboutProperty(userId, messageObj, res)
}

const markAsReadThisMessage = async (req, res) => {
    const { userId, messageId } = req.params;
    return markAsRead(userId, messageId, res)
}

const deleteThisMessage = async (req, res) => {
    const { userId, messageId } = req.params;
    return deleteMessage(userId, messageId, res)
}

export {
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
};