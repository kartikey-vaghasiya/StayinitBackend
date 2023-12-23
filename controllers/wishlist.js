const Wishlist = require("../models/Wishlist")

async function getWishlist(req, res) {
    // Find all wishlist from db
    try {

        const { userId, propertyId } = req.params
        const { type } = req.query

        const filterobj = {}
        if (userId) {
            filterobj.user = userId
        }
        if (propertyId) {
            if (type) {

                if (type === "flat") {
                    filterobj.flatId = propertyId
                } else if (type === "hostel") {
                    filterobj.hostelId = propertyId
                }
            }
        }

        if (!userId && !flatId && !hostelId && !propertyId) {
            res.status(400).json({
                "success": false,
                "message": "Bad Request ( userId or wishlistId or propertyId ) are required",
                "data": {}
            })
        }
        const data = await Wishlist.find(filterobj)
            .populate("user")
            .populate({
                path: "flatId",
                populate: { path: "arrayOfImages" }
            })
            .populate({
                path: "hostelId",
                populate: { path: "arrayOfImages" }
            });

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
            "message": e.message,
            "data": {}
        })
    }
}

async function addWishlist(req, res) {

    try {
        // Get id from body
        const { flatId, hostelId, user, type } = req.body

        const isWishExist = await Wishlist.findOne({ flatId, hostelId, user: user })

        if (isWishExist) {
            await isWishExist.deleteOne()
        }

        // create db entry
        const wish = new Wishlist({
            "flatId": flatId,
            "hostelId": hostelId,
            "type": type,
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
            "error": e.message,
            "data": {}
        })
    }
}

async function removeFromWishlist(req, res) {
    // get id of wish 
    const { userId, propertyId } = req.params
    const { type } = req.query

    const quertyObj = {}
    if (userId) {
        quertyObj.user = userId
    }
    if (propertyId) {
        if (type === "flat") {
            quertyObj.flatId = propertyId
        } else if (type === "hostel") {
            quertyObj.hostelId = propertyId
        }
    }

    // remove it from db
    Wishlist.findOneAndDelete(quertyObj)
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
                "error": e.message,
                "data": {}
            })
        })
}

module.exports = { getWishlist, addWishlist, removeFromWishlist }