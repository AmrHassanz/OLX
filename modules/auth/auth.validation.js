const Joi = require('joi');
// signup
const signup = {
    body: Joi.object().required().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        gender: Joi.valid('Male', 'Female').required(),
        password: Joi.string().required(),
        cPassword: Joi.string().valid(Joi.ref('password')).required()
    })
}
// login
const login = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
}
// send confirmation email
const confirmEmail = {
    params: Joi.object().required().keys({
        token: Joi.string().required(),
    }),
}
// re-send confirmation email
const reConfirmationEmail = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    }),
}

// forget password
const sendCode = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
    })
}
const forgetPassword = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        code: Joi.number().required(),
        newPassword: Joi.string().required(),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    })
}


module.exports = { signup, login, confirmEmail, reConfirmationEmail, sendCode, forgetPassword };