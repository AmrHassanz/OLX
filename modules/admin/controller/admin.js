const userModel = require("../../../DB/model/user");
const productModel = require("../../../DB/model/product");
const commentModel = require("../../../DB/model/comment");



// delete profile
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        // delete user
        const user = await userModel.findByIdAndDelete(id);
        // delete user comments and likes
        const allComments = await commentModel.find({});
        const userComments = await commentModel.find({ createdBy: id });
        const userCommentsIdArr = userComments.map(c => c._id);
        allComments.forEach(async (comment) => {
            if (comment.createdBy.equals(id)) {
                // delete user comment
                await commentModel.findByIdAndDelete(comment._id);
            } else {
                // delete user replies and likes
                await commentModel.findByIdAndUpdate(comment._id, { $pullAll: { replies: userCommentsIdArr }, $pull: { likes: id } });
            }
        })
        // delete user products
        const allProducts = await productModel.find({});
        allProducts.forEach(async (product) => {
            if (product.createdBy.equals(id)) {
                await productModel.findByIdAndDelete(product._id);
            } else {
                await productModel.findByIdAndUpdate(product._id, { $pull: { wishList: id, likes: id }, $pullAll: { comments: userCommentsIdArr } });
            }
        })
        res.status(200).json({ message: 'Done' });
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// profile soft delete
const softDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            res.status(400).json({ message: 'in-valid account id' });
        }
        else {
            if (!user.isDeleted) {
                await userModel.findOneAndUpdate({ _id: user._id }, { isDeleted: true });
                res.status(200).json({ message: 'account is temporary  deleted' });
            } else {
                await userModel.findOneAndUpdate({ _id: user._id }, { isDeleted: false });
                res.status(200).json({ message: 'account is Restored' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}


module.exports = {
    deleteProfile, softDelete
};