const Comment = require('../models/Comment');
const Flat = require('../models/Flat');
const Hostel = require('../models/Hostel');
const User = require('../models/User');

async function addComment(req, res) {

    try {
        // geeting { flat/hosted id , comment , user } data from req.body
        const { hostelOrFlatId, comment, user, starRating } = req.body
        // if any of these data is missing then return error
        if (!hostelOrFlatId || !user || !starRating) {
            return res.json({
                "success": false,
                "message": "Either flat/hostel id or starrating or user data is missing",
                "data": {}
            })
        }
        // if any of the comment and StarRating is already exist then delete prev and add this comment 
        const commentExist = await Comment.findOne({ hostelOrFlatId, user })

        if (commentExist) {
            await commentExist.deleteOne()
        }

        // find if user is exist or not
        // find if flat/hostel is exist or not
        const userExist = await User.findById(user);
        const flatExist = await Flat.findById(hostelOrFlatId);
        const hostelExist = await Hostel.findById(hostelOrFlatId);

        if (!userExist || (!flatExist && !hostelExist)) {
            return res.json({
                "success": false,
                "message": "Either user or flat/hostel is not exist",
                "data": {}
            })
        }

        // if user and flat/hostel is exist then add comment to database
        const commentObj = new Comment({
            comment,
            user,
            hostelOrFlatId,
            starRating
        });
        await commentObj.save();

        // return success message
        res.json({
            "success": true,
            "message": "comment added successfully",
            "data": commentObj
        })
    } catch (error) {
        res.json({
            "success": false,
            "message": "error during adding comment",
            "error": error.message,
            "data": {}
        })
    }
}

async function getCommentForFlatOrHostel(req, res) {
    try {
        // getting flat/hostel id from req.params
        const { hostelOrFlatId } = req.params;

        // if flat/hostel id is not exist then return error
        if (!hostelOrFlatId) {
            return res.json({
                "success": false,
                "message": "flat/hostel id is missing",
                "data": {}
            })
        }

        // find all comments for this flat/hostel
        const comments = await Comment.find({ hostelOrFlatId: hostelOrFlatId }).populate('user');
        secureComment = comments.map((comment) => {
            comment.user.password = undefined;
            return comment;
        })

        // return success message
        res.json({
            "success": true,
            "message": "comments fetched successfully",
            "data": secureComment
        })
    } catch (error) {
        console.log(error);
        res.json({
            "success": false,
            "message": "error during fetching comments",
            "error": error.message,
            "data": {}
        })
    }
}

async function getAverageRating(req, res) {
    const { hostelOrFlatId } = req.params;

    try {
        // check if hostelOrFlatId is exist or not
        if (!hostelOrFlatId) {
            return res.json({
                "success": false,
                "message": "flat/hostel id is missing",
                "data": {}
            })
        }
        // check if hostel or flat releted to this id is exist or not
        const flatExist = await Flat.findById(hostelOrFlatId);
        let hostelExist;
        if (!flatExist) {
            hostelExist = await Hostel.findById(hostelOrFlatId);
            if (!hostelExist) {
                return res.json({
                    "success": false,
                    "message": "flat/hostel is not exist",
                    "data": {}
                })
            }
        }

        // if exist then find average rating for this hostel/flat
        const comments = await Comment.find({ hostelOrFlatId: hostelOrFlatId });
        let sum = 0;
        comments.forEach(comment => {
            sum += comment.starRating;
        });
        const averageRating = sum / comments.length;

        // return success message
        res.json({
            "success": true,
            "message": "average rating fetched successfully",
            "data": averageRating
        })
    } catch (error) {
        // return error message
        res.status(500).json({
            "success": false,
            "message": "error during fetching average rating",
            "error": error.message,
            "data": {}
        })
    }
}

module.exports = {
    addComment,
    getAverageRating,
    getCommentForFlatOrHostel
}