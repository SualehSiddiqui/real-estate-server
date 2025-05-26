import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    address: {
        type: String,
        required: false,
        trim: true,
    },
}, {
    timestamps: true
})


const User = model("User", UserSchema);

export default User;