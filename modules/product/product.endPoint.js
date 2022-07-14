const { roles } = require("../../middlewear/auth");


const endPoint = {
    addProduct: [roles.User],
    updateProduct: [roles.User],
    deleteProduct: [roles.User, roles.Admin],
    softDelete: [roles.User, roles.Admin],
    likeProduct: [roles.User],
    wishList: [roles.User],
    hideProduct: [roles.User],
}
module.exports = endPoint;
