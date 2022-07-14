const { roles } = require("../../middlewear/auth");

const endPoint = {
    updatePassword: [roles.User, roles.Admin],
    updateEmail: [roles.User, roles.Admin],
    deleteProfile: [roles.User, roles.Admin],
    profilePic: [roles.User, roles.Admin],
    coverPic: [roles.User, roles.Admin],
}

module.exports = endPoint;