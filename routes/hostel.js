const express = require("express")
const router = express.Router()


const { getHostel, getAllHostels, addHostel, updateHostel, deleteHostel, addPricingAndSharingDetails, addAminitiesDetails, addHostelImages } = require('../controllers/hostel')

const AuthMiddlewere = require("../middleweres/auth")

router.post("/", addHostel)

router.get("/", getAllHostels)
router.get("/:id", getHostel)

router.patch("/:id", updateHostel)
router.delete("/:id", deleteHostel)

router.post("/pricing", addPricingAndSharingDetails)

router.post("/hostel-image", addHostelImages)


module.exports = router

