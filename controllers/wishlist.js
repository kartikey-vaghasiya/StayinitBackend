const Wishlist = require("../models/Wishlist")
const Profile = require("../models/Profile")

async function addWish(req, res) {

    try {

        const { profile, flat, hostel, type } = req.body

        const isWishExist = await Wishlist.findOne({
            flat: type === "flat" ? flat : undefined,
            hostel: type === "hostel" ? hostel : undefined,
            profile
        })

        if (isWishExist) {
            return res.status(200).json({
                "success": true,
                "message": "Wish already exist",
                "data": isWishExist
            })
        }

        const wish = new Wishlist({
            flat: type === "flat" ? flat : undefined,
            hostel: type === "hostel" ? hostel : undefined,
            type,
            profile
        })

        await wish.save()

        const userProfile = await Profile.findById(profile)

        userProfile.wishlist.push(wish._id)
        await userProfile.save()

        res.status(200).json({
            "success": true,
            "message": "wish added successfully",
            "data": wish
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function getWishlist(req, res) {
    try {

        const { profileId } = req.params;

        if (!profileId) {
            return res.status(500).json({
                "success": false,
                "message": "profileId is required",
            })
        }

        const isProfileExist = await Profile.findById(profileId);
        if (!isProfileExist) {
            return res.status(500).json({
                "success": false,
                "message": "profile is not exist",
            })
        }

        const wishlist = await Wishlist.find({ profile: profileId })
            .populate({
                path: "flat",
                populate: {
                    path: "arrayOfImages",
                }
            })
            .populate({
                path: "hostel",
                populate: {
                    path: "arrayOfImages",
                }
            })

        res.status(200).json({
            "success": true,
            "message": "wishlist fetched successfully",
            "data": wishlist
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function removeWish(req, res) {

    try {

        const { profileId, type, hostelOrFlatId } = req.params;

        if (!profileId || !type || !hostelOrFlatId) {
            return res.status(500).json({
                "success": false,
                "message": "profileId or type or hostelOrFlatId is required",
            })
        }

        if (type !== "flat" && type !== "hostel") {
            return res.status(500).json({
                "success": false,
                "message": "type must be flat or hostel",
            })
        }

        const isProfileExist = await Profile.findById(profileId);
        if (!isProfileExist) {
            return res.status(500).json({
                "success": false,
                "message": "profile is not exist",
            })
        }

        const wishlist = await Wishlist.findOne({
            profile: profileId,
            flat: type === "flat" ? hostelOrFlatId : undefined,
            hostel: type === "hostel" ? hostelOrFlatId : undefined,
            type
        })

        if (!wishlist) {
            return res.status(500).json({
                "success": false,
                "message": "wishlist is not exist",
            })
        }

        const userProfile = await Profile.findById(profileId)
        userProfile.wishlist.pull(wishlist._id)
        await userProfile.save()

        await wishlist.deleteOne()

        res.status(200).json({
            "success": true,
            "message": "wishlist removed successfully",
            "data": wishlist
        })


    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

module.exports = { addWish, getWishlist, removeWish }