const bcrypt = require('bcrypt');
const userModel = require("../../../DB/model/user");
const productModel = require('../../../DB/model/product');
const commentModel = require('../../../DB/model/comment');

const sendEmail = require('../../../services/email');
const jwt = require('jsonwebtoken');
const { paginate } = require('../../../services/paginate');


// update password
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(req.user._id);
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            res.status(400).json({ message: 'in-valid old password' });
        }
        else {
            if (oldPassword === newPassword) {
                res.status(409).json({ message: 'sorry u have to make new one' });
            } else {
                const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound));
                await userModel.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true });
                res.status(200).json({ message: 'Done' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Catch error', error });
    }
}

// update email
const updateEmail = async (req, res) => {
    const { email } = req.body;
    if (email === req.user.email) {
        res.status(409).json({ message: 'sorry u have to write new email' });
    }
    else {
        try {
            await userModel.findByIdAndUpdate(req.user._id, { email, confirmEmail: false }, { new: true });

            // send confirmation email
            const token = jwt.sign({ id: req.user._id }, process.env.emailToken, { expiresIn: 5 * 60 }); // five min
            const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`;
            const link2 = `${req.protocol}://${req.headers.host}/api/v1/auth/refreshEmail/${req.user._id}`;
            const message = `<a href='${link}'>plz follow me to confirm u account</a>
          <br>
          <a href='${link2}'>re-send confirmation email</a>`;
            sendEmail(email, message);

            res.status(201).json({ message: 'Done' });
        } catch (error) {
            if (error.keyValue?.email) {
                res.status(409).json({ message: 'email exist' });
            } else {
                res.status(500).json({ message: 'catch error', error });
            }
        }
    }
}

// delete profile
const deleteProfile = async (req, res) => {
    try {
        // delete user
        const user = await userModel.findByIdAndDelete(req.user._id);
        // delete user comments and likes
        const allComments = await commentModel.find({});
        const userComments = await commentModel.find({ createdBy: req.user._id });
        const userCommentsIdArr = userComments.map(c => c._id);
        allComments.forEach(async (comment) => {
            if (comment.createdBy.equals(req.user._id)) {
                // delete user comment
                await commentModel.findByIdAndDelete(comment._id);
            } else {
                // delete user replies and likes
                await commentModel.findByIdAndUpdate(comment._id, { $pullAll: { replies: userCommentsIdArr }, $pull: { likes: req.user._id } });
            }
        })
        // delete user products
        const allProducts = await productModel.find({});
        allProducts.forEach(async (product) => {
            if (product.createdBy.equals(req.user._id)) {
                await productModel.findByIdAndDelete(product._id);
            } else {
                await productModel.findByIdAndUpdate(product._id, { $pull: { wishList: req.user._id, likes: req.user._id }, $pullAll: { comments: userCommentsIdArr } });
            }
        })
        res.status(200).json({ message: 'Done' });
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}

// update profile picture
const profilePic = async (req, res) => {
    try {
        if (req.fileErr) {
            res.status(400).json({ message: "in-valid file format" });
        } else {
            const imagesURL = [];
            req.files.forEach(file => {
                imagesURL.push(`${req.finalDistination}/${file.filename}`);
            })
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { profilePic: imagesURL }, { new: true });
            res.status(200).json({ message: "Done", user });
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
}

// update profile cover
const coverPic = async (req, res) => {
    try {
        if (req.fileErr) {
            res.status(400).json({ message: "in-valid file format" });
        } else {
            const imagesURL = [];
            req.files.forEach(file => {
                imagesURL.push(`${req.finalDistination}/${file.filename}`);
            })
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { coverPic: imagesURL }, { new: true });
            res.status(200).json({ message: "Done", user });
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error });
    }
};

// get all users
const getAllUsers = async (req, res) => {

    const { page, size } = req.query;
    const { limit, skip } = paginate(page, size);

    const users = [];
    const cursor = userModel.find({}).limit(limit).skip(skip).select('firstName lastName email gender wishList phone').populate([
        { path: 'wishList', select: 'title desc price' }
    ]).cursor();
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        const product = await productModel.find({ createdBy: doc._id }).select('title desc price likes comments wishList').populate([
            {
                path: 'likes',
                select: 'firstName lastName email',
            },
            {
                path: 'comments',
                select: 'body createdBy replies likes',
                populate: [
                    { path: 'createdBy', select: 'firstName lastName email' },
                    { path: 'replies', select: 'body createdBy replies', populate: { path: 'replies', select: 'body createdBy replies' } },
                    { path: 'likes', select: 'firstName lastName email' }
                ]
            },
            {
                path: 'wishList',
                select: 'firstName lastName email',
            },
        ]);
        users.push({ user: doc, products: product });
    }
    res.status(200).json({ message: 'Done', users });
}

module.exports = {
    updatePassword, updateEmail, deleteProfile, profilePic, coverPic, getAllUsers
};