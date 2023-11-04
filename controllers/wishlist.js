const Wishlist = require("../models/Wishlist")

async function getWishlist(req, res) {
    // Find all wishlist from db
    try {

        const filterOption = {}
        const { user } = req.query

        filterOption.user = user

        const data = await Wishlist.find({})
            .populate("user")
            .populate("likedProperty")

        if (data.length > 0) {
            res.status(200).json({
                "success": true,
                "message": "Get Request Successful",
                "data": data
            })
        } else {
            res.status(404).json({
                "success": true,
                "message": "Wishlist is empty",
                "data": data
            })
        }


    } catch (e) {
        res.status(500).json({
            "success": false,
            "error": e,
            "data": {}
        })
    }
}
async function addWishlist(req, res) {

    try {
        // Get id from body
        const { likedProperty, user } = req.body

        // create db entry
        const wish = new Wishlist({
            "likedProperty": likedProperty,
            "user": user
        })

        wish.save()
            .then((createdWish) => {
                res.status(200).json({
                    "success": true,
                    "message": "Wish Added Successfully",
                    "data": createdWish
                })
            })
            .catch((e) => {
                res.status(500).json({
                    "success": true,
                    "message": e,
                    "data": {}
                })
            })

    } catch (e) {
        res.status(500).json({
            "success": false,
            "error": e,
            "data": {}
        })
    }
}
async function removeFromWishlist(req, res) {
    // get id of wish 
    const { id } = req.params

    // remove it from db
    Wishlist.findByIdAndDelete(id)
        .then((deleted) => {
            res.status(200).json({
                "success": true,
                "message": "Wish Removed Successfully",
                "data": deleted
            })
        })
        .catch((e) => {
            res.status(500).json({
                "success": false,
                "error": e,
                "data": {}
            })
        })
}

module.exports = { getWishlist, addWishlist, removeFromWishlist }