import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PropertySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Ensures no leading or trailing spaces
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Ensures the price is not negative
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
        required: true,
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
        bedrooms: {
            type: Array,
            required: false,
        },
        bathrooms: {
            type: Array,
            required: false,
        },
        appliances: {
            type: Array,
            required: false,
        },
        interiorFeatures: {
            type: Array,
            required: false,
        },
        heatingCooling: {
            type: Array,
            required: false,
        },
        exterior: {
            type: Array,
            required: false,
        },
        garage: {
            type: Array,
            required: false,
        },
        landInfo: {
            type: Array,
            required: false,
        },
        homeownersAssociation: {
            type: Array,
            required: false,
        },
        schoolInfo: {
            type: Array,
            required: false,
        },
        rentalInfo: {
            type: Array,
            required: false,
        },
        amenities: {
            type: Array,
            required: false,
        },
        otherInfo: {
            type: Array,
            required: false,
        },
        buildingAndConstruction: {
            type: Array,
            required: false,
        },
        utilities: {
            type: Array,
            required: false,
        },
        homeFeatures: {
            type: Array,
            required: false,
        },
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

// Create and export the model
const Property = model('Property', PropertySchema);

export default Property;
