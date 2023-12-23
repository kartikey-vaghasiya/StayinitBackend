const express = require('express');
const router = express.Router();
const { addComment, getCommentForFlatOrHostel, getAverageRating } = require('../controllers/comment');

router.post('/comment', addComment);
router.get('/getComments/:hostelOrFlatId', getCommentForFlatOrHostel);
router.get('/getAverageRating/:hostelOrFlatId', getAverageRating);

module.exports = router;