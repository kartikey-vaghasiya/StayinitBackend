const mongoose = require("mongoose")


const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
    },

    hostelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
    },

    type: {
        type: String,
        enum: ["hostel", "flat"],
    }

})

module.exports = mongoose.model("Wishlist", WishlistSchema)