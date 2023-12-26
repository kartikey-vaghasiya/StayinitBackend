const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    email: {
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

    phoneNumber: {
        type: String,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },


}, { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
