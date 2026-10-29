const Joi = require('joi');

const joiReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5),
    
    comment: Joi.string().trim().required()

})

module.exports = joiReviewSchema;