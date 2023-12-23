const express = require("express")
const Router = express.Router()

const { getWishlist, addWishlist, removeFromWishlist } = require("../controllers/wishlist")

const AuthMiddlewere = require("../middleweres/auth")

Router.get("/:userId", getWishlist)
Router.get("/:userId/:propertyId", getWishlist)

Router.post("/", addWishlist)
Router.delete("/:userId/:propertyId", removeFromWishlist)

module.exports = Router

// in phase 2