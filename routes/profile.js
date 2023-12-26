const express = require("express");
const router = express.Router();

const {
    createProfile,
    getOneProfile,
    getAllProfiles,
    updateProfile,
    deleteProfile
} = require("../controllers/profile.js");

// Profile - C - R - U - D 
router.post('/', createProfile)

router.get('/:userId', getOneProfile)
router.get('/', getAllProfiles)

router.patch('/:userId', updateProfile)
router.delete('/:userId', deleteProfile)


module.exports = router;