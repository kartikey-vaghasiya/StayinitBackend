const express = require("express")
const router = express.Router()

const AuthMiddlewere = require("../middleweres/auth")

const {
    addWish,
    getWishlist,
    removeWish,
} = require("../controllers/wishlist")

router.post("/", addWish)

router.get("/profile/:profileId", getWishlist)

router.delete("/profile/:profileId/:type/:hostelOrFlatId", removeWish)

module.exports = router
