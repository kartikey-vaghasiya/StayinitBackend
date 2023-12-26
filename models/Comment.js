const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },

    comment: {
        type: String,
    },

    rating: {
        type: Number,
        default: 3,
        min: 1,
        max: 5,
        required: true
    },

    type: {
        type: String,
        enum: ['flat', 'hostel'],
        required: true
    },

    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
}, { timestamps: true },
);

module.exports = mongoose.model('Comment', commentSchema)