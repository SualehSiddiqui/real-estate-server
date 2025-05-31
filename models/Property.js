import mongoose from "mongoose";

const { Schema, model } = mongoose;

const FeatureSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    list: {
        type: [String],
        required: true,
        default: [],
    },
}, { _id: false });

const PropertySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    bed: {
        type: String,
        required: true,
        trim: true,
    },
    bath: {
        type: String,
        required: true,
        trim: true,
    },
    houseSqft: {
        type: String,
        required: true,
        trim: true,
    },
    lotSqft: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    zipCode: {
        type: String,
        required: false,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    details: {
        type: {
            type: String,
            required: true,
            trim: true,
        },
        yearBuilt: {
            type: String,
            required: true,
            trim: true,
        },
        availablity: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    features: {
        type: [FeatureSchema],  // Array of feature objects as per your JSON structure
        default: [],
    },
    status: {
        type: Boolean,
        default: true,
    },
    availableFor: {
        type: String,
        required: true,
        trim: true,
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
}, {
    timestamps: true,
});

const Property = model('Property', PropertySchema);

export default Property;
