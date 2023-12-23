const mongoose = require("mongoose");
const { resetPasswordMailSender } = require("../config/nodemailer");

const PasswordResetTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60 * 1000,
    }
});

async function sendPasswordResetMail(email, token) {
    try {
        const mailResponse = await resetPasswordMailSender(email, token);
    } catch (error) {
        console.log(error)
        throw error;
    }
}

PasswordResetTokenSchema.pre("save", async function (next) {
    await sendPasswordResetMail(this.email, this.token);
    next();
});

module.exports = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);