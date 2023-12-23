const mongoose = require('mongoose')

const Flatschema = new mongoose.Schema({

    // uploaded_by:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },

    property_name: {
        type: String,
        required: true,
    },

    property_price: {
        type: Number,
        required: true,
    },

    property_bhk: {
        type: Number,
        required: true,
    },

    property_sqft: {
        type: Number,
        required: true
    },

    property_devloper: {
        type: String,
    },

    property_locality: {
        type: String,
        required: true,
    },

    property_city: {
        type: String,
        required: true,
    },

    atWhichFloor: {
        type: Number,
    },

    totalFloor: {
        type: Number,
    },

    nearestLandmark: {
        type: [String]
    },

    description: {
        type: String,
    },

    num_of_baths: {
        type: Number,
    },

    num_of_balconies: {
        type: Number,
    },

    furnitureType: {
        type: String,
        enum: ["Furnished", "Unfurnished", "Semifurnished"],
        required: true
    },

    arrayOfImages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Image"
    },

    locality_url: {
        type: String,
    },

    contactNum: String,

    contactMail: {
        type: String,
        required: true,
        validate: {
            validator: function (email) {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                return emailRegex.test(email);
            },

            message: "Invalid Email"
        },
    },

    address: String,


}, { timestamps: true })

module.exports = mongoose.model("Flat", Flatschema)