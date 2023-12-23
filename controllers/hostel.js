const Hostel = require("../models/Hostel")
const PricingAndSharing = require("../models/PricingAndSharing")
const Image = require("../models/Image")
const { findById } = require("../models/Flat")

async function getHostel(req, res) {
    try {
        // Get Id
        const { id } = req.params

        // Get Hostel From DB Using ID
        const data = await Hostel.findById(id).populate('pricingAndSharing').populate('arrayOfImages')


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
        const {
            gender,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning,
        } = req.query

        const sortByPrice = req.query.sortByPrice;
        const minPrice = req.query.minPrice || 0
        const maxPrice = req.query.maxPrice || Infinity

        queryObj = {}
        if (liftFacility) {
            queryObj.liftFacility = liftFacility
        }
        if (wifiFacility) {
            queryObj.wifiFacility = wifiFacility
        }
        if (gymFacility) {
            queryObj.gymFacility = gymFacility
        }
        if (acFacility) {
            queryObj.acFacility = acFacility
        }
        if (gamingRoom) {
            queryObj.gamingRoom = gamingRoom
        }
        if (freeLaundry) {
            queryObj.freeLaundry = freeLaundry
        }
        if (securityGuard) {
            queryObj.securityGuard = securityGuard
        }
        if (filterWater) {
            queryObj.filterWater = filterWater
        }
        if (cctv) {
            queryObj.cctv = cctv
        }
        if (cleaning) {
            queryObj.cleaning = cleaning
        }
        if (gender) {
            queryObj.forWhichGender = gender
        }



        // Get All Hostel From
        const data = await Hostel.find(queryObj)
            .populate('pricingAndSharing')
            .populate('arrayOfImages')
            .exec()

        // Filters based on price and sqft and sorting also
        const filteredData = data.filter((hostel) => {
            // Pricing and sharing array
            const pricingAndSharingArray = hostel.pricingAndSharing;

            // min and max of pricing and sharing array
            const minPriceLocal = pricingAndSharingArray.reduce((acc, curr) => {
                return (
                    Math.min(curr.price, acc)
                )
            }, Infinity)
            const maxPriceLocal = pricingAndSharingArray.reduce((acc, curr) => {
                return (
                    Math.max(curr.price, acc)
                )
            }, 0)


            // applying filter and sorting 
            return (minPrice <= maxPriceLocal && maxPrice >= minPriceLocal)

        }).sort((hostelA, hostelB) => {

            // Pricing and sharing array
            const pricingAndSharingArrayA = hostelA.pricingAndSharing;

            // min and max of pricing and sharing array
            const minPriceLocalA = pricingAndSharingArrayA.reduce((acc, curr) => {
                return (
                    Math.min(curr.price, acc)
                )
            }, Infinity)

            // Pricing and sharing array
            const pricingAndSharingArrayB = hostelB.pricingAndSharing;

            // min and max of pricing and sharing array
            const minPriceLocalB = pricingAndSharingArrayB.reduce((acc, curr) => {
                return (
                    Math.min(curr.price, acc)
                )
            }, Infinity)

            if (sortByPrice == 1) {
                return (minPriceLocalA - minPriceLocalB)
            } else {
                return (minPriceLocalB - minPriceLocalA)
            }
        })

        if (filteredData.length > 0) {
            res.status(200).json({
                "success": true,
                "message": "Successful Get Request",
                "data": filteredData
            })
        } else {
            res.status(404).json({
                "success": false,
                "error": "Hostels Not Found",
                "data": {}
            })
        }
    } catch (e) {
        res.status(500).json({
            "success": false,
            "error": e.message,
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
            arrayOfImages,
            locality,
            city,
            forWhichGender,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning,
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
            arrayOfImages,
            locality,
            city,
            forWhichGender,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning,
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
            arrayOfImages,
            locality,
            city,
            forWhichGender,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning,
            description,
            contactNum,
            contactMail,
            address,
            nearestLandmarks
        } = req.body

        const updatedHostel = {
            hostel_name,
            pricingAndSharing,
            arrayOfImages,
            locality,
            city,
            forWhichGender,
            liftFacility,
            wifiFacility,
            gymFacility,
            acFacility,
            gamingRoom,
            freeLaundry,
            securityGuard,
            filterWater,
            cctv,
            cleaning,
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
        reletedHostel.arrayOfImages.push(createdHostelImage._id)
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
    addHostelImages,
}