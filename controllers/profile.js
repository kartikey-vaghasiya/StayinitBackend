const Profile = require("../models/Profile");
const User = require("../models/User");

const createProfile = async (req, res) => {

    try {
        const {
            userId,
            firstname,
            lastname,
            username,
            profilePicture,
        } = req.body;

        if (!userId) {
            return res.status(500).json({
                "success": false,
                "message": "userId is required",
            });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(500).json({
                "success": false,
                "message": "user not found with given userId",
            });
        }

        const isProfileAlreadyExist = await Profile.findOne({ userId });
        if (isProfileAlreadyExist) {
            return res.status(500).json({
                "success": false,
                "message": "profile already exist with given userId",
            });
        }

        const usernameForProfile = username || userData.username;

        const createProfile = new Profile({
            userId,
            firstname,
            lastname,
            "username": usernameForProfile,
            profilePicture,
            comments: [],
            wishlist: [],
        });

        await createProfile.save();

        await User.findOneAndUpdate({ _id: userId }, { profile: createProfile._id }, { new: true });

        res.status(201).json({
            "success": true,
            "message": "profile created successfully",
            "data": createProfile,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

const getOneProfile = async (req, res) => {
    try {
        const {
            userId
        } = req.params;

        if (!userId) {
            return res.status(500).json({
                "success": false,
                "message": "userId is required",
            });
        }

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(500).json({
                "success": false,
                "message": "profile not found with given userId",
            });
        }

        res.status(200).json({
            "success": true,
            "message": "profile found successfully",
            "data": profile,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

const getAllProfiles = async (req, res) => {
    try {

        const { userId, username } = req.query;
        const queryObject = {};

        userId ? queryObject.userId = userId : null;
        username ? queryObject.username = username : null;

        const profiles = await Profile.find(queryObject);

        res.status(200).json({
            "success": true,
            "message": "profiles found successfully",
            "data": profiles,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const {
            userId
        } = req.params;

        if (!userId) {
            return res.status(500).json({
                "success": false,
                "message": "userId is required",
            });
        }

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(500).json({
                "success": false,
                "message": "profile not found with given userId",
            });
        }

        const updatedProfile = await Profile.findOneAndUpdate({ userId }, req.body, { new: true });

        res.status(200).json({
            "success": true,
            "message": "profile updated successfully",
            "data": updatedProfile,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

const deleteProfile = async (req, res) => {
    try {
        const {
            userId
        } = req.params;

        if (!userId) {
            return res.status(500).json({
                "success": false,
                "message": "userId is required",
            });
        }

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(500).json({
                "success": false,
                "message": "profile not found with given userId",
            });
        }

        const deletedProfile = await Profile.findOneAndDelete({ userId });

        res.status(200).json({
            "success": true,
            "message": "profile deleted successfully",
            "data": deleteProfile,
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        });
    }
}

module.exports = {
    createProfile,
    getOneProfile,
    getAllProfiles,
    updateProfile,
    deleteProfile
}