const Joi = require("joi");

// add product
const addProduct = {
    body: Joi.object().required().keys({
        title: Joi.string().min(2).required(),
        desc: Joi.string().min(2).required(),
        price: Joi.number().required()
    })
}

// add product
const updateProduct = {
    body: Joi.object().required().keys({
        title: Joi.string().min(10).required(),
        desc: Joi.string().min(10).required(),
        price: Joi.number().required(),
    }),
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

// delete product
const deleteProduct = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

// soft delete product
const softDelete = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

// like product
const likeProduct = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

// add to wishlist
const wishList = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

// hide product
const hideProduct = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}




module.exports = { addProduct, updateProduct, deleteProduct, softDelete, likeProduct ,wishList,hideProduct};