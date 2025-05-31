import Joi from 'joi';

const FeatureItemSchema = Joi.object({
    title: Joi.string().trim().required(),
    list: Joi.array().items(Joi.string().trim()).required(),
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
    zipCode: Joi.string().trim(),
    location: Joi.string().trim().required(),
    details: Joi.object({
        type: Joi.string().trim().required(),
        yearBuilt: Joi.string().trim().required(),
        availablity: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
    }).required(),
    features: Joi.array().items(FeatureItemSchema).optional(),
    status: Joi.boolean().default(true),
    availableFor: Joi.string().trim().required(),
    addedBy: Joi.string().required(),
    imgUrl: Joi.array().items(
        Joi.object({
            url: Joi.string().uri().optional(),
            public_id: Joi.string().optional(),
        })
    ).optional(),
});

export default PropertySchema;
