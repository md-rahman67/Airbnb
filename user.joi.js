const Joi = require('joi');

const joiUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),

    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }),

    password: Joi.string().required().min(8).max(16)
})

module.exports = joiUserSchema;