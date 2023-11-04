const mongoose = require("mongoose")
const PricingSchema = new mongoose.Schema({

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
    },

    sharing: {
        type: Number,
        required: true
    },
    
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("PricingAndSharing", PricingSchema)