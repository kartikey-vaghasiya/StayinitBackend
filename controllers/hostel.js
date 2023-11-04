const Hostel = require("../models/Hostel")
const PricingAndSharing = require("../models/PricingAndSharing")
const Aminities = require("../models/Aminities")
const Image = require("../models/Image")
const { findById } = require("../models/Flat")

async function getHostel(req, res) {
    try {
        // Get Id
        const { id } = req.params

        // Get Hostel From DB Using ID
        const data = await Hostel.findById(id).populate('pricingAndSharing').populate('aminities').populate('imageUrlArray')

        if (data) {
            res.status(200).json({
                "success": true,
                "message": "Get Request Successful",
                "data": data
            })
        } else {
            res.status(404).json({
                "success": false,
                "error": "Hostel not found",
                "data": data
            })
        }

    } catch (e) {
        res.status(500).json({
            "success": false,
            "error": e,
            "data": {}
        })
    }

}

async function getAllHostels(req, res) {
    try {

        const { sort, name, locality, city, gender } = req.query

        queryObj = {}

        if (name) {
            queryObj.hostel_name = { $regex: name, $options: 'i' }
        }

        if (locality) {
            queryObj.property_locality = { $regex: locality, $options: 'i' }
        }

        if (city) {
            queryObj.property_city = { $regex: city, $options: 'i' }
        }

        if (gender) {
            queryObj.forWhichGender = gender
        }

        // Get All Hostel From
        const data = await Hostel.find(queryObj).populate('pricingAndSharing').populate('imageUrlArray').populate('aminities')
            .sort(sort)
            .exec()

        if (data.length > 0) {
            res.status(200).json({
                "success": true,
                "message": "Successful Get Request",
                "data": data
            })
        } else {
            res.status(404).json({
                "success": false,
                "error": "Hostels Not Found",
                "data": data
            })
        }

    } catch (e) {
        res.status(500).json({
            "success": false,
            "error": e,
            "data": {}
        })
    }
}

async function addHostel(req, res) {
    try {
        // Get Hostel Data From Request
        const {
            hostel_name,
            pricingAndSharing,
            imageUrlArray,
            locality,
            city,
            forWhichGender,
            aminities,
            description,
            contactNum,
            contactMail,
            address,
            nearestLandmarks
        } = req.body

        // Create Hostel Object
        const hostel = new Hostel({
            hostel_name,
            pricingAndSharing,
            imageUrlArray,
            locality,
            city,
            forWhichGender,
            aminities,
            description,
            contactNum,
            contactMail,
            address,
            nearestLandmarks
        })

        const hostelData = await hostel.save()
        
        res.status(201).json({
            "success": true,
            "message": "Hostel created successfully",
            "data": hostelData
        })
    }

    catch (e) {
        res.status(500).json({
            "success": false,
            "error": e,
            "data": {}
        })
    }

}

async function deleteHostel(req, res) {
    try {
        // Get Id
        const { id } = req.params

        // Get Hostel From DB Using ID
        Hostel.findByIdAndDelete(id)
            .then((deletedHostel) => {
                res.status(200).json({
                    "success": true,
                    "message": "Hostel Deleted Successfuly",
                    "data": deletedHostel
                })
            })
            .catch((e) => {
                res.status(404).json({
                    "success": false,
                    "error": e,
                    "data": {}
                })
            })


    } catch (e) {
        res.status(500).json({
            "success": false,
            "error": e,
            "data": {}
        })
    }
}

async function updateHostel(req, res) {
    try {
        // Get Id
        const { id } = req.params
        const {
            hostel_name,
            pricingAndSharing,
            imageUrlArray,
            locality,
            city,
            forWhichGender,
            aminities,
            description,
            contactNum,
            contactMail,
            address,
            nearestLandmarks
        } = req.body

        const updatedHostel = {
            hostel_name,
            pricingAndSharing,
            imageUrlArray,
            locality,
            city,
            forWhichGender,
            aminities,
            description,
            contactNum,
            contactMail,
            address,
            nearestLandmarks
        }

        // Get Hostel From DB Using ID
        Hostel.findByIdAndUpdate(id, updatedHostel, { new: true, runValidators: true })
            .then((EditedHostel) => {
                res.status(200).json({
                    "success": true,
                    "message": "Hostel Updated Successfuly",
                    "data": EditedHostel
                })
            })
            .catch((e) => {
                res.status(404).json({
                    "success": false,
                    "error": e,
                    "data": {}
                })
            })


    } catch (e) {
        res.status(500).json({
            "success": false,
            "error": e,
            "data": {}
        })
    }
}

async function addPricingAndSharingDetails(req, res) {
    // Get pricing object
    try {
        const { hostel, sharing, price } = req.body

        const pricing = new PricingAndSharing({
            "hostel": hostel,
            "sharing": sharing,
            "price": price,
        })
        
        // Creating entry in DB
        const createdPricing = await pricing.save()

        if (hostel) {
            const reletedHostel = await Hostel.findOne({ _id: hostel })
            reletedHostel.pricingAndSharing.push(pricing._id)
            await reletedHostel.save()
        }

        res.status(200).json({
            "success": true,
            "message": "Pricing Created Successfully",
            "data": createdPricing
        })


    } catch (e) {
        res.status(500).json({
            "success": false,
            "message": e,
            "data": {}
        })
    }
}

async function addAminitiesDetails(req, res) {

    try {
        const {
            hostel,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning
        } = req.body

        let aminities = new Aminities({
            hostel,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning
        })

        // Creating entry in DB
        await aminities.save()

        // Get the hostel document that you want to update
        const hostelDocument = await Hostel.findOne({ _id: hostel })

        // Add the amenities ID to the `amenities` field of the hostel document
        hostelDocument.aminities = aminities._id

        // Update the hostel document
        await hostelDocument.save()

        res.status(201).json({
            "success": true,
            "message": "Aminities Created Successfully",
            "data": aminities
        })
    } catch (e) {
        res.status(500).json({
            "success": false,
            "message": e,
            "data": {}
        })
    }

}

async function addHostelImages(req, res) {
    try {
        const {
            url,
            flatOrHostelId,
            tags,
        } = req.body

        let hostelImages = new Image({
            url,
            flatOrHostelId,
            tags,
        })

        // Creating entry in DB
        const createdHostelImage = await hostelImages.save()

        const reletedHostel = await Hostel.findOne({ _id: flatOrHostelId })
        reletedHostel.imageUrlArray.push(createdHostelImage._id)
        await reletedHostel.save()

        if (createdHostelImage) {
            res.status(201).json({
                "success": true,
                "message": "Hostel Images Added Successfully",
                "data": createdHostelImage
            })
        }

    } catch (e) {
        res.status(500).json({
            "success": false,
            "message": e,
            "data": {}
        })
    }
}

module.exports = {
    getHostel,
    getAllHostels,
    addHostel,
    deleteHostel,
    updateHostel,
    addPricingAndSharingDetails,
    addAminitiesDetails,
    addHostelImages,
}