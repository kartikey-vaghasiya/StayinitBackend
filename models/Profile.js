const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },

    firstname: String,

    lastname: String,

    username: String,

    profilePiture: String,

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],

    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist"
    }],

}, { timestamps: true });

module.exports = mongoose.model("Profile", ProfileSchema);
