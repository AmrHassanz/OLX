const productModel = require('../../../DB/model/product');
const QRCode = require('qrcode');
const userModel = require('../../../DB/model/user');
const { getIo } = require('../../../services/socket');
const commentModel = require('../../../DB/model/comment');



// add product
const addProduct = async (req, res) => {
    try {
        const { title, desc, price } = req.body;
        // QRCode
        QRCode.toDataURL(JSON.stringify({ title, desc, price }), async function (err, url) {
            if (err != null) {
                res.status(400).json({ message: 'QR Code Error', err });
            } else {
                const newProduct = new productModel({ title, desc, price, createdBy: req.user._id, QRCode: url });
                const savedProduct = await newProduct.save();
                getIo().emit('post', [savedProduct]);
                res.status(201).json({ message: 'Done', savedProduct });
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// update product
const updateProduct = async (req, res) => {
    try {
        const { title, desc, price } = req.body;
        const { id } = req.params;

        const product = await productModel.findById(id);
        if (!product) {
            res.status(400).json({ message: 'in-valid product id' });
        } else {

            QRCode.toDataURL(JSON.stringify({ title, desc, price }), async function (err, url) {
                if (err != null) {
                    res.status(400).json({ message: 'QR Code Error', err });
                } else {
                    const updatedProduct = await productModel.findOneAndUpdate({ _id: id, createdBy: req.user._id }, { title, desc, price, QRCode: url }, { new: true });
                    res.status(201).json({ message: 'Done', updatedProduct });
                }
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(400).json({ message: 'in-valid product id' });
        } else {
            if (product.createdBy.equals(req.user._id)) {
                // delete comments on product
                const productComments = product.comments;
                productComments.forEach(async (comment) => {
                    await commentModel.findByIdAndDelete(comment._id);
                })
                // delete product
                await productModel.findByIdAndDelete(product._id);
                res.status(200).json({ message: 'product is deleted' });
            } else {
                res.status(400).json({ message: 'you can not delete this product' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// soft delete
const softDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(400).json({ message: 'in-valid product id' });
        } else {
            if (!product.isDeleted) {
                await productModel.findOneAndUpdate({ _id: product._id }, { isDeleted: true });
                res.status(200).json({ message: 'product is temporary deleted' });
            } else {
                await productModel.findOneAndUpdate({ _id: product._id }, { isDeleted: false });
                res.status(200).json({ message: 'product is un deleted' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// like product
const likeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(400).json({ message: 'in-valid product id' });
        } else {
            if (product.likes.includes(req.user._id)) {
                await productModel.findByIdAndUpdate(id, { $pull: { likes: req.user._id } });
                res.status(200).json({ message: 'you unliked the product' });
            } else {
                await productModel.findByIdAndUpdate(id, { $push: { likes: req.user._id } });
                res.status(200).json({ message: 'you liked the product' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// add to wishlist
const wishList = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        const user = await userModel.findById(req.user._id);


        if (!product) {
            res.status(400).json({ message: 'in-valid product id' });
        } else {
            if (product.createdBy.equals(user._id)) {
                res.status(409).json({ message: 'you cant add product you have created to wishlist' });
            }
            else {
                if (user.wishList.includes(product._id)) {
                    res.status(409).json({ message: 'product is already in whishlist' });
                } else {
                    await userModel.findByIdAndUpdate(user._id, { $push: { wishList: id } });
                    await productModel.findByIdAndUpdate(id, { $push: { wishList: user._id } });
                    res.status(200).json({ message: 'Done' });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// hide product
const hideProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(400).json({ message: 'in-valid product id' });
        } else {
            if (product.isHidden) {
                await productModel.findOneAndUpdate({ _id: product._id, createdBy: req.user._id }, { isHidden: false });
                res.status(200).json({ message: 'product is visible' });
            } else {
                await productModel.findOneAndUpdate({ _id: product._id, createdBy: req.user._id }, { isHidden: true });
                res.status(200).json({ message: 'product is hidden' });
            }
        }

    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}




module.exports = {
    addProduct, updateProduct, deleteProduct, softDelete, likeProduct, wishList, hideProduct
}