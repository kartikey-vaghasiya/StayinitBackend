const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
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

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["User", "Admin", "Owner"],
        default: "User"
    },

    phoneNumber: {
        type: String,
        unique: true,
    }



}, { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
