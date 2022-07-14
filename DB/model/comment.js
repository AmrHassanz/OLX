const mongoose = require('mongoose');

// 01
const commentSchema = new mongoose.Schema({
    body: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
})
// increase version
commentSchema.pre('findOneAndUpdate', async function (next) {
    const hookData = await this.model.findOne(this.getQuery()).select('__v');
    this.set({ __v: hookData.__v + 1 });
})

// 02
const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
