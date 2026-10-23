const Joi = require('joi');

const joiListingSchema = Joi.object({
    title: Joi.string().trim().required(),

    description: Joi.string().trim().required(),

    image: Joi.string().allow("", null),

    price: Joi.number().min(0).required(),

    location: Joi.string().trim().required(),

    country: Joi.string().trim().required(),
})

module.exports = joiListingSchema;