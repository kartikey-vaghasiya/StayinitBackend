const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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
        phoneNumber
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

        // Step 4: If User Not Created Before then ...
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

        res.json({
            "success": true,
            "message": "User Created Successfully",
            "data": newUser
        });

        // If Any Error Accures During This Process Then Give Internal Server Error
    } catch (error) {
        res.status(500).json({
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
        "user": req.user.id
    }

    res.status(200).json({
        "success": true,
        "message": "This user is authenticated",
        "data": data
    })
}

module.exports = {
    login,
    signup,
    isAuthenticate
}