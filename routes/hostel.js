const express = require("express")
const Router = express.Router()


const { getHostel, getAllHostels, addHostel, updateHostel, deleteHostel, addPricingAndSharingDetails, addAminitiesDetails, addHostelImages } = require('../controllers/hostel')

const AuthMiddlewere = require("../middleweres/auth")

Router.get("/", getAllHostels)
Router.get("/:id", getHostel)

Router.post("/", addHostel)
Router.put("/:id", updateHostel)
Router.delete("/:id", deleteHostel)

Router.post("/pricing", addPricingAndSharingDetails)

Router.post("/hostel-image", addHostelImages)


module.exports = Router

// Need to imporve hostelimage insertion 
