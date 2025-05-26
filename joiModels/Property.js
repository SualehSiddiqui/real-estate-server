import Joi from 'joi';

const PropertySchema = Joi.object({
    name: Joi.string().trim().min(3).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().trim().required(),
    shades: Joi.array(),
    description: Joi.string().trim().min(3).required(),
    careInstruction: Joi.string().trim().min(3).required(),
    specification: Joi.string().trim().min(3).required(),
    shippingAndReturn: Joi.string().trim().min(3).required(),
    status: Joi.boolean().default(true),
    discountPercentage: Joi.number().min(0),
    priceBeforeDiscount: Joi.number().min(0),
    imgUrl: Joi.array().items(Joi.object({
        url: Joi.string(),
        public_id: Joi.string(),
    })),
});

export default PropertySchema;
