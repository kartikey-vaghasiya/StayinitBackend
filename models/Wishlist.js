const mongoose = require("mongoose")


const WishlistSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },

    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
    },

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
    },

    type: {
        type: String,
        enum: ["hostel", "flat"],
    }

})

module.exports = mongoose.model("Wishlist", WishlistSchema)