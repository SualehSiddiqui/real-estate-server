import Joi from 'joi';

const FeatureSchema = Joi.object({
    bedrooms: Joi.array().items(Joi.any()).optional(),
    bathrooms: Joi.array().items(Joi.any()).optional(),
    appliances: Joi.array().items(Joi.any()).optional(),
    interiorFeatures: Joi.array().items(Joi.any()).optional(),
    heatingCooling: Joi.array().items(Joi.any()).optional(),
    exterior: Joi.array().items(Joi.any()).optional(),
    garage: Joi.array().items(Joi.any()).optional(),
    landInfo: Joi.array().items(Joi.any()).optional(),
    homeownersAssociation: Joi.array().items(Joi.any()).optional(),
    schoolInfo: Joi.array().items(Joi.any()).optional(),
    rentalInfo: Joi.array().items(Joi.any()).optional(),
    amenities: Joi.array().items(Joi.any()).optional(),
    otherInfo: Joi.array().items(Joi.any()).optional(),
    buildingAndConstruction: Joi.array().items(Joi.any()).optional(),
    utilities: Joi.array().items(Joi.any()).optional(),
    homeFeatures: Joi.array().items(Joi.any()).optional(),
});

const PropertySchema = Joi.object({
    title: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    address: Joi.string().trim().required(),
    bed: Joi.string().trim().required(),
    bath: Joi.string().trim().required(),
    houseSqft: Joi.string().trim().required(),
    lotSqft: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    zipCode: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    details: Joi.object({
        type: Joi.string().trim().required(),
        yearBuilt: Joi.string().trim().required(),
        availablity: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
    }).required(),
    features: FeatureSchema.optional(),
    status: Joi.boolean().default(true),
    availableFor: Joi.string().trim().required(),
    imgUrl: Joi.array().items(
        Joi.object({
            url: Joi.string().uri().optional(),
            public_id: Joi.string().optional(),
        })
    ).optional(),
});

export default PropertySchema;
