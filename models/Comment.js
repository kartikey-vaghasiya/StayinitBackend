const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hostelOrFlatId: {
        type: mongoose.Schema.Types.Mixed,
    },
    commentedAt: {
        type: Date,
        default: Date.now()
    },
    starRating: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
        required: true
    },
}
);

module.exports = mongoose.model('Comment', commentSchema)