const express = require('express');
const router = express.Router();

const {
    addComment,
    getAllFlatComments,
    getAllHostelComments,
    getAverageRating,
    deleteComment
} = require('../controllers/comment');

router.post('/', addComment);

router.get('/flat/:flatId', getAllFlatComments);
router.get('/hostel/:hostelId', getAllHostelComments);


router.delete('/:commentId', deleteComment)


module.exports = router;