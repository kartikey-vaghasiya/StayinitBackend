const mongoose = require("mongoose")


const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    likedProperty: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
})

module.exports = mongoose.model("Wishlist", WishlistSchema)