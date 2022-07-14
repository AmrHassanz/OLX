const Joi = require("joi");

// update password
const updatePassword = {
    body: Joi.object().required().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    })
}

// update email
const updateEmail = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
    })
}


module.exports = { updatePassword, updateEmail };