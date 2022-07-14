const mongoose = require('mongoose');


// 01
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    QRCode: { type: String },
    
    isHidden: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // parent child relation
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true
})
// increase version
productSchema.pre('findOneAndUpdate', async function (next) {
    const hookData = await this.model.findOne(this.getQuery()).select('__v');
    this.set({ __v: hookData.__v + 1 });
})

// 02
const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
