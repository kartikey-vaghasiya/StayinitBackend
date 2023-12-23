const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const OTP = require("../models/Otp")
const crypto = require("crypto");
const PasswordResetToken = require("../models/PasswordResetToken");

function generateOTP() {


    var digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;


}

async function sendOTP(req, res) {

    try {
        // generate new otp
        const otp = generateOTP();

        // get email from req.body
        const { email } = req.body;

        // check if email is present in req.body
        if (!email) {
            return res.status(400).json({
                "success": false,
                "message": "Email not found",
                "data": {}
            })
        }

        // create entry in db for otp
        const newOTP = new OTP({
            email,
            otp
        });

        // save otp in db
        await newOTP.save();

        // send response
        return res.status(200).json({
            "success": true,
            "message": "OTP sent successfully",
            "data": newOTP
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
            "data": {}
        })
    }

}

async function signup(req, res) {

    // Get Data from req.body
    const {
        firstname,
        lastname,
        username,
        email,
        password,
        confirmPassword,
        role,
        phoneNumber,
        otp
    } = req.body;


    // Step 1: Check if ( Email And Username ) And ( Password and Confirmation Password ) is provided or Not
    if (!email || !username || !((password.length) > 8) || !((confirmPassword.length) > 8)) {
        return res.json({
            "success": false,
            "message": "Please provide email and password of valid length",
            "data": {}
        });
    }


    // Step 2: if all values are Provided then Compare Password with Confirmation Password
    if (password !== confirmPassword) {
        return res.json({
            "success": false,
            "message": "Both Password does'nt match",
            "data": {}
        })
    }

    // Step 3: Check if  Already a User Is Exist with that email or username or Not 
    try {
        const existingUser = await (User.findOne({ email: email }) || User.findOne({ username: username }))

        if (existingUser) {
            return res.json({
                "success": false,
                "message": "You already have an account linked to this email or username",
                "data": {}
            });
        }


        // Step 4: Verify OTP

        // most recent otp present in db
        const OTPinDB = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);

        // if otp is not present in db
        if (!OTPinDB) {
            return res.status(400).json({
                "success": false,
                "message": "Otp not found",
                "data": OTPinDB
            })
        }

        if (otp != OTPinDB.otp) {
            return res.status(400).json({
                "success": false,
                "message": "Otp not matched",
                "data": {}
            })
        }

        // Step 5: If User Not Created Before then ...
        // Hash the password
        hash = await bcrypt.hash(password, 10)

        const newUser = new User({
            firstname,
            lastname,
            username,
            email,
            "password": hash,
            role,
            phoneNumber
        });

        // Create Entry in DB
        await newUser.save();

        res.status(200).json({
            "success": true,
            "message": "User Created Successfully",
            "data": newUser
        });

        // If Any Error Accures During This Process Then Give Internal Server Error
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error,
            "data": {}
        });
    }
}

async function login(req, res) {
    // Get Data From req.body
    const { usernameOrEmail, password } = req.body;

    // Step 1: Check if User Entered ( Username Or Email ) And Password
    if (!usernameOrEmail && !password) {
        return res.json({
            "success": false,
            "message": "Please provide email and password",
            "data": {}
        })
    }

    try {

        // Step 2: Finding User by it's Username or Email
        const existingUser = await User.findOne({ email: usernameOrEmail }) || await User.findOne({ username: usernameOrEmail });

        // Step 3: If User Exist Then Compare Password
        if (existingUser) {

            // Bcrypt Function to compare passwords ( plainPassword , SaltedPassword )
            let comparePassword = await bcrypt.compare(password, existingUser.password)

            // Step 3.1 : If Password Matches then Login Succesfully
            if (comparePassword) {

                // Step 3.2 Create JWT Token And Save it into Cookie
                const userData = {
                    id: existingUser._id,
                    email: existingUser.email,
                    username: existingUser.username,
                    role: existingUser.role
                }

                const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' })

                existingUser.password = undefined;

                return res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 })
                    .json({
                        "success": true,
                        "token": token,
                        "message": "User Logged in succesfully",
                        "data": existingUser
                    })

                // Step 3.1 : If Password Doesn't Match then Give Failure Response
            } else {
                return res.json({
                    "success": false,
                    "message": "Password is not matching",
                    "data": {}
                })
            }

            // Step 3.2 If User Not Exist Then Give Failure Message
        } else {
            return res.json({
                "success": false,
                "message": "User not found",
                "data": {}
            })
        }

        // If Any Error Accures During This Process Then Give Internal Server Error
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "data": {}
        });
    }
}

async function isAuthenticate(req, res) {

    const data = {
        "user": req.user.id,
    }

    res.status(200).json({
        "success": true,
        "message": "This user is authenticated",
        "data": data
    })
}

async function sendResetPasswordLink(req, res) {

    const { email } = req.body;

    try {
        // 1st check if user exist or not
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                "success": false,
                "message": "User not found with that particular email",
                "data": {}
            })
        }

        // 2nd check if token already exist or not
        // if exist {
        //      delete that token
        // }
        // then --> create new token

        const token = await PasswordResetToken.findOne({ email: email });
        if (token) {
            await token.deleteOne();
        }

        // 3rd create hash string and check if hash exist or not 
        const resetPasswordHash = crypto.randomBytes(32).toString("hex");

        if (!resetPasswordHash) {
            return res.status(500).json({
                "success": false,
                "message": "Something went wrong",
                "data": {}
            })
        }


        // 4th save resetPasswordHash into ResetPasswordToken's DB
        const resetPasswordToken = new PasswordResetToken({
            email: email,
            token: resetPasswordHash
        });

        await resetPasswordToken.save();

        res.json({
            "success": true,
            "message": "Reset password link sent successfully",
            "data": {}
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "data": {}
        })
    }

}

async function verifyResetPasswordLink(req, res) {
    const { password, confirmPassword, token, email } = req.body;
    try {
        // step - 1 : check if token exist or not
        const dbToken = await PasswordResetToken.findOne({ email: email, token: token })

        if (!dbToken) {
            return res.status(400).json({
                "success": false,
                "message": "token not matched",
                "data": {}
            })
        }

        // step - 2 check for the both passwords is same or not 
        if (password !== confirmPassword) {
            return res.status(400).json({
                "success": false,
                "message": "Both Password does'nt match",
                "data": {}
            })
        }

        // step - 3 hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // step - 4 update user's data in db
        const updatedUser = await User.findOneAndUpdate({ email: email }, { password: hashedPassword }, { new: true });

        res.status(200).json({
            "success": true,
            "message": "Password reset successfully",
            "data": {}
        })
    }

    catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "data": {}
        })
    }
}

async function getUserInfo(req, res) {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                "success": false,
                "message": "User not found",
                "data": {}
            })
        }

        const userData = {
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "email": user.email,
            "phoneNumber": user.phoneNumber
        }

        res.status(200).json({
            "success": true,
            "message": "User found",
            "data": userData
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "data": {}
        })
    }
}

module.exports = {
    login,
    signup,
    isAuthenticate,
    sendOTP,
    sendResetPasswordLink,
    verifyResetPasswordLink,
    getUserInfo
}