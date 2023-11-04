const express = require("express");
const router = express.Router();
const authMiddlewere = require("../middleweres/auth")

const { login, signup, isAuthenticate } = require("../controllers/auth.js")

/*

login : "POST" : for login
signup : "POST" : for creating new account
isAuthenticate : "GET" : send token in body -> and know if this token is valid or not :
                                                        -> if valid : sends user's id
*/
router.post('/login', login)
router.post('/signup', signup)
router.get('/isAuthenticate', authMiddlewere, isAuthenticate)

module.exports = router;