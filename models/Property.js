import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PropertySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Ensures no leading or trailing spaces
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Ensures the price is not negative
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    shades: {
        type: Array,
        required: false,
        default: [],
    },
    description: {
        type: String,
        required: true,
    },
    specification: {
        type: String,
        required: true,
    },
    careInstruction: {
        type: String,
        required: true,
    },
    shippingAndReturn: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    imgUrl: [
        {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            }
        }
    ],
    discountPercentage: {
        type: Number,
        required: false,
        min: 0, // Ensures the price is not negative
    },
    priceBeforeDiscount: {
        type: Number,
        required: false,
        min: 0, // Ensures the price is not negative
    },
}, {
    timestamps: true,
});

// Create and export the model
const Item = model('Item', PropertySchema);

export default Item;
