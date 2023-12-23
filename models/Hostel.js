const mongoose = require('mongoose')
const Pricing = require('./PricingAndSharing')

const HostelSchema = new mongoose.Schema({

    // uploaded_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },

    hostel_name: {
        type: String,
        required: true,
    },

    pricingAndSharing: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "PricingAndSharing",
        required: true
    },

    arrayOfImages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Image"
    },

    locality: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    forWhichGender: {
        type: String,
        enum: ["Boys", "Girls", "Both"],
        required: true
    },

    liftFacility: Boolean,
    wifiFacility: Boolean,
    gymFacility: Boolean,
    acFacility: Boolean,
    gamingRoom: Boolean,
    freeLaundry: Boolean,
    securityGuard: Boolean,
    filterWater: Boolean,
    cctv: Boolean,
    cleaning: Boolean,

    description: {
        type: String,
    },

    contactNum: String,

    contactMail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                return emailRegex.test(email);
            },

            message: "Invalid Email"
        },
    },

    address: String,

    nearestLandmarks: [String],

}, { timestamps: true })

module.exports = mongoose.model("Hostel", HostelSchema)