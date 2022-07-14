const { roles } = require("../../middlewear/auth");

const endPoint = {
    deleteProfile: [roles.Admin],
    softDelete: [roles.Admin],
}

module.exports = endPoint;