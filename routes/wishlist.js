const express = require("express")
const Router = express.Router()

const { getWishlist, addWishlist, removeFromWishlist } = require("../controllers/wishlist")

const AuthMiddlewere = require("../middleweres/auth")

Router.get("/", getWishlist)
Router.post("/", AuthMiddlewere, addWishlist)
Router.delete("/:id", AuthMiddlewere, removeFromWishlist)

module.exports = Router

// in phase 2