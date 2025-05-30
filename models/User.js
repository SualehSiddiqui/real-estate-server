import mongoose, { SchemaTypeOptions, Types } from "mongoose";

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
    messages: [
        {
            message: {
                type: String,
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            phone: {
                type: String,
                required: false,
            },
            email: {
                type: String,
                required: false,
            },
            desiredDate: {
                type: String,
                required: false,
            },
            createdAt: {
                type: Date,
                required: false,
            },
            property: {
                type: Object,
                required: false
            },
            read: {
                type: Boolean,
                default: false,
            }
        }
    ]
}, {
    timestamps: true
})


const User = model("User", UserSchema);

export default User;