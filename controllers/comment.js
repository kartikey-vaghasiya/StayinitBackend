const Comment = require('../models/Comment');
const Flat = require('../models/Flat');
const Hostel = require('../models/Hostel');
const User = require('../models/User');
const Profile = require('../models/Profile');

async function addComment(req, res) {

    try {

        const {
            rating,
            comment,
            flat,
            hostel,
            profile,
            type
        } = req.body


        if (type === "flat" && !flat || type === "hostel" && !hostel) {
            return res.status(500).json({
                "success": false,
                "message": "for flat flat and for hostel hostel is required",
            })
        }

        if (!rating || !(flat || hostel) || !profile || !type) {
            return res.status(500).json({
                "success": false,
                "message": "rating, flat/hostel, profile, type these fields are required",
            })
        }

        const commentInDB = await Comment.findOne({
            flat: type === "flat" ? flat : undefined,
            hostel: type === "hostel" ? hostel : undefined,
            profile
        })

        if (commentInDB) {
            await commentInDB.deleteOne()
            const profileForCommentInDB = await Profile.findById(profile);
            profileForCommentInDB.comments.pull(commentInDB._id);
            profileForCommentInDB.save();
        }

        const profileInDB = await Profile.findById(profile);
        const flatInDB = await Flat.findById(flat);
        const hostelInDB = await Hostel.findById(hostel);

        if (!profileInDB || (!flatInDB && !hostelInDB)) {
            return res.status(500).json({
                "success": false,
                "message": "profile or flat or hostel is not exist",
            })
        }

        const newComment = new Comment({
            rating,
            comment,
            "flat": type === 'flat' ? flat : undefined,
            "hostel": type === 'hostel' ? hostel : undefined,
            profile,
            type
        });

        await newComment.save();

        const userProfile = await Profile.findById(profile)

        userProfile.comments.push(newComment._id);
        await userProfile.save();

        res.json({
            "success": true,
            "message": "comment added successfully",
            "data": newComment
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

async function getAllFlatComments(req, res) {
    try {
        const { flatId } = req.params;

        if (!flatId) {
            return res.status(500).json({
                "success": false,
                "message": "flat-id is required",
            })
        }

        const comments = await Comment.find({ flat: flatId }).populate('profile');

        const numOfRating = comments.length;
        const sumOfRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        const averageRating = sumOfRating / numOfRating;

        res.status(200).json({
            "success": true,
            "message": "comments fetched successfully",
            "data": { "comments": comments, "averageRating": averageRating }
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }

}

async function getAllHostelComments(req, res) {
    try {
        const { hostelId } = req.params;

        if (!hostelId) {
            return res.status(500).json({
                "success": false,
                "message": "hostel-id is required",
            })
        }

        const comments = await Comment.find({ hostel: hostelId }).populate('profile');


        const numOfRating = comments.length;
        const sumOfRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        const averageRating = sumOfRating / numOfRating;

        res.status(200).json({
            "success": true,
            "message": "comments fetched successfully",
            "data": { "comments": comments, "averageRating": averageRating }
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }

}

async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;

        if (!commentId) {
            return res.status(500).json({
                "success": false,
                "message": "comment-id is required",
            })
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(500).json({
                "success": false,
                "message": "comment is not exist",
            })
        }

        const userProfile = await Profile.findById(comment.profile);

        if (!userProfile) {
            return res.status(500).json({
                "success": false,
                "message": "user profile is not exist",
            })
        }

        userProfile.comments.pull(comment._id);
        await userProfile.save();

        await comment.deleteOne();

        res.status(200).json({
            "success": true,
            "message": "comment deleted successfully",
            "data": comment
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }

}

module.exports = {
    addComment,
    getAllFlatComments,
    getAllHostelComments,
    deleteComment
}