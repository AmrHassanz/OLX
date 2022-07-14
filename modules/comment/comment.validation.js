const Joi = require('joi');

// create comment
const createComment = {
    body: Joi.object().required().keys({
        body: Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
    })
}

// reply on comment
const replyOnComment = {
    body: Joi.object().required().keys({
        body: Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}

// update comment
const updateComment = {
    body: Joi.object().required().keys({
        body: Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}

// delete comment
const deleteComment = {
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}

// like comment
const likeComment = {
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}

module.exports = { createComment, replyOnComment, updateComment, deleteComment, likeComment };