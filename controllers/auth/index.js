import {
    createUser,
    validateUser,
    forgetPassword,
    resetPasswordUi,
    resetPassword,
    // updateUser,
    getOneUser,
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

// const updateUserInfo = async (req, res) => {
//     const { id, password } = req.params;
//     const userObj = req.body;
//     return updateUser(id, password, userObj, res)
// }

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    return getOneUser(id, res)
}

export {
    signin,
    login,
    forgetUserPassword,
    resetUserPasswordUi,
    resetUserPassword,
    // updateUserInfo,
    getSingleUser,
};