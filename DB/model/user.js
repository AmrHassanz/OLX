const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


// schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    age: { type: Number },
    profilePic: { type: Array },
    coverPic: { type: Array },
    QRCode: { type: String },
    isDeleted: { type: Boolean, default: false },
    confirmEmail: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    role: { type: String, default: 'User' },
    code: String,
    socketID: String,
    lastSeen: String
}, {
    timestamps: true
})

// hash password before saving in DB
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, parseInt(process.env.saltRound));
    next();
})

// increse version
userSchema.pre('findOneAndUpdate', async function (next) {
    const hookData = await this.model.findOne(this.getQuery()).select('__v');
    this.set({ __v: hookData.__v + 1 });
})

// model
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
