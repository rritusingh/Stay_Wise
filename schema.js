const Joi = require('joi');

module.exports.listingSchems = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.string().required().min(0),
        title: Joi.string().allow("", null),
    }).required(),
});