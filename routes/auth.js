const express = require("express");
const router = express.Router();
const authMiddlewere = require("../middleweres/auth")
const { login, signup, isAuthenticate, sendOTP, sendResetPasswordLink, verifyResetPasswordLink, getUserInfo } = require("../controllers/auth.js");
const { verify } = require("crypto");

/*

login : "POST" : for login
signup : "POST" : for creating new account
isAuthenticate : "GET" : send token in body -> and know if this token is valid or not :
                                                        -> if valid : sends user's id
*/
router.post('/login', login)
router.post('/signup', signup)
router.get('/isAuthenticate', authMiddlewere, isAuthenticate)
router.post('/otp', sendOTP)
router.post('/send-reset-password-token', sendResetPasswordLink)
router.post('/verify-reset-password-token', verifyResetPasswordLink)
router.get('/userinfo/:userId', getUserInfo)

module.exports = router;