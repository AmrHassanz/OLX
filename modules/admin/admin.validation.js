const Joi = require("joi");

// delete profile
const deleteProfile = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    })
}

// soft delete
const softDelete = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    })
}

module.exports = { deleteProfile, softDelete };