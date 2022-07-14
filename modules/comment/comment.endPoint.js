const { roles } = require("../../middlewear/auth");

const endPoint = {
    createComment: [roles.User],
    replyOnComment: [roles.User],
    updateComment: [roles.User],
    deleteComment: [roles.User],
    likeComment: [roles.User],
}

module.exports = endPoint;