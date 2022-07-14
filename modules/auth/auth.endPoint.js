const { roles } = require("../../middlewear/auth");



const endPoint = {
    logout: [roles.User, roles.Admin, roles.HR]
}

module.exports = endPoint;