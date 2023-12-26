const User = require("../models/User")
const Profile = require("../models/Profile")
const Otp = require("../models/Otp")
const PasswordResetToken = require("../models/PasswordResetToken")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

require('dotenv').config();

async function login(req, res) {

    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(500).json({
                "success": false,
                "message": "email and password are required",
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(500).json({
                "success": false,
                "message": "user not found with given email",
            })
        }

        // compare plain-password & salted-password
        const isPasswordSame = await bcrypt.compare(password, user.password)

        if (!isPasswordSame) {
            return res.status(500).json({
                "success": false,
                "message": "password is incorrect",
            })
        }

        const userProfile = await Profile.findOne({ userId: user._id })
        if (!userProfile) {
            return res.status(500).json({
                "success": false,
                "message": "user profile not found",
            })
        }

        const token = jwt.sign({ "profile": userProfile }, process.env.JWT_SECRET, { expiresIn: '1h' })

        return res
            .status(200)
            .json({
                "success": true,
                "token": token,
                "message": "user logged-in successfully",
                "data": userProfile
            })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

async function isAuthenticate(req, res) {

    try {
        const profile = req.user;

        res.status(200).json({
            "success": true,
            "message": "user is authenticated",
            "data": profile
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

async function register(req, res) {

    try {
        const {
            username,
            role,
            email,
            phoneNumber,
            password,
            confirmPassword
        } = req.body;

        if (!(username && email && password && confirmPassword)) {
            return res.status(500).json({
                "success": false,
                "message": "all fields are required",
            })
        }

        if (password !== confirmPassword) {
            return res.status(500).json({
                "success": false,
                "message": "password and confirm-password are not same",
            })
        }

        if (password.length < 8) {
            return res.status(500).json({
                "success": false,
                "message": "password length must be greater than 8",
            })
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.json({
                "success": false,
                "message": "user already exists with given email",
            });
        }

        const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))

        const newUser = new User({
            username,
            role,
            email,
            phoneNumber,
            password: hash
        });

        await newUser.save();

        const profile = new Profile({
            userId: newUser._id,
            username,
            comments: [],
            wishlist: [],
        });

        await profile.save();

        newUser.profile = profile._id;

        res.status(200).json({
            "success": true,
            "message": "user registered successfully",
            "data": newUser
        });

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

async function sendOTP(req, res) {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(500).json({
                "success": false,
                "message": "email is required",
            })
        }

        const emailInDB = await User.findOne({ email });

        if (emailInDB) {
            return res.status(500).json({
                "success": false,
                "message": "user already exist with given email",
            })
        }

        const otpInDB = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        if (otpInDB) {
            await otpInDB.deleteOne()
        }

        // generating otp...
        let digits = '0123456789';
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }

        const newOTP = new Otp({
            email,
            otp
        });

        await newOTP.save();

        return res.status(200).json({
            "success": true,
            "message": "otp created successfully",
            "data": newOTP
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function verifyOTP(req, res) {

    try {

        const { email, otp } = req.body;

        if (!(email && otp)) {
            return res.status(500).json({
                "success": false,
                "message": "email and otp are required",
            })
        }

        const OTPinDB = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);

        if (!OTPinDB) {
            return res.status(500).json({
                "success": false,
                "message": "otp not found",
            })
        }

        if (otp !== OTPinDB.otp) {
            return res.status(500).json({
                "success": false,
                "message": "incorrect otp",
            })
        }

        await Otp.findByIdAndDelete(OTPinDB._id)

        res.status(200).json({
            "success": true,
            "message": "otp verified successfully",
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function sendResetPasswordLink(req, res) {

    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({
                "success": false,
                "message": "user not found with given email",
            })
        }

        const token = await PasswordResetToken.findOne({ email });
        if (token) {
            await token.deleteOne();
        }

        const resetPasswordHash = crypto.randomBytes(32).toString("hex");

        if (!resetPasswordHash) {
            return res.status(500).json({
                "success": false,
                "message": "reset password hash not found",
            })
        }

        const resetPasswordToken = new PasswordResetToken({
            email: email,
            token: resetPasswordHash
        });

        await resetPasswordToken.save();

        res.status(200).json({
            "success": true,
            "message": "reset password link sent successfully",
        })

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }

}

async function verifyResetPasswordLink(req, res) {

    try {
        const { password, confirmPassword, token, email } = req.body;

        const tokenInDB = await PasswordResetToken.findOne({ email, token })

        if (!tokenInDB) {
            return res.status(500).json({
                "success": false,
                "message": "token not found",
            })
        }

        if (password !== confirmPassword) {
            return res.status(500).json({
                "success": false,
                "message": "password and confirm-password are not same",
            })
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

        await tokenInDB.deleteOne();

        res.status(200).json({
            "success": true,
            "message": "password reset successfully",
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

module.exports = {
    login,
    isAuthenticate,
    register,
    sendOTP,
    verifyOTP,
    sendResetPasswordLink,
    verifyResetPasswordLink
}
