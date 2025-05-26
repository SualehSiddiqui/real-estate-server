import Joi from "joi";

const UserSchema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).required(),
    phone: Joi.string().trim().required(),
    address: Joi.string().trim().min(3),
})

export default UserSchema;