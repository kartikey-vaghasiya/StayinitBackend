const Hostel = require("../models/Hostel")
const PricingAndSharing = require("../models/PricingAndSharing")
const Image = require("../models/Image")

async function getHostel(req, res) {
    try {
        const { id } = req.params

        const data = await Hostel.findById(id).populate('pricingAndSharing').populate('arrayOfImages')


        if (data) {
            return res.status(200).json({
                "success": true,
                "message": "get hostel successfull",
                "data": data
            })
        } else {
            return res.status(404).json({
                "success": false,
                "error": "hostel not foun",
                "data": data
            })
        }

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
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

        const data = await Hostel.find(queryObj)
            .populate('pricingAndSharing')
            .populate('arrayOfImages')
            .exec()

        const filteredData = data.filter((hostel) => {

            const pricingAndSharingArray = hostel.pricingAndSharing;

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

            return (minPrice <= maxPriceLocal && maxPrice >= minPriceLocal)

        }).sort((hostelA, hostelB) => {

            const pricingAndSharingArrayA = hostelA.pricingAndSharing;

            const minPriceLocalA = pricingAndSharingArrayA.reduce((acc, curr) => {
                return (
                    Math.min(curr.price, acc)
                )
            }, Infinity)

            const pricingAndSharingArrayB = hostelB.pricingAndSharing;

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
            return res.status(200).json({
                "success": true,
                "message": "all hostels fetched successfully",
                "data": filteredData
            })
        } else {
            return res.status(404).json({
                "success": false,
                "error": "hostels not found",
            })
        }
    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function addHostel(req, res) {
    try {
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
            "message": "hostel added successfully",
            "data": hostelData
        })
    }

    catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }

}

async function deleteHostel(req, res) {
    try {
        const { id } = req.params

        Hostel.findByIdAndDelete(id)
            .then((deletedHostel) => {
                return res.status(200).json({
                    "success": true,
                    "message": "hostel deleted successfully",
                    "data": deletedHostel
                })
            })
            .catch((error) => {
                return res.status(404).json({
                    "success": false,
                    "error": error.message,
                })
            })


    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function updateHostel(req, res) {
    try {
        const { id } = req.params

        Hostel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .then((EditedHostel) => {
                return res.status(200).json({
                    "success": true,
                    "message": "hostel updated successfully",
                    "data": EditedHostel
                })
            })
            .catch((error) => {
                return res.status(404).json({
                    "success": false,
                    "error": error.message,
                })
            })


    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function addPricingAndSharingDetails(req, res) {
    try {
        const { hostel, sharing, price } = req.body

        const pricing = new PricingAndSharing({
            "hostel": hostel,
            "sharing": sharing,
            "price": price,
        })

        const createdPricing = await pricing.save()

        if (hostel) {
            const reletedHostel = await Hostel.findOne({ _id: hostel })
            reletedHostel.pricingAndSharing.push(pricing._id)
            await reletedHostel.save()
        }

        res.status(200).json({
            "success": true,
            "message": "pricing and sharing added successfull",
            "data": createdPricing
        })


    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
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

        const createdHostelImage = await hostelImages.save()


        if (createdHostelImage) {

            const reletedHostel = await Hostel.findOne({ _id: flatOrHostelId })
            reletedHostel.arrayOfImages.push(createdHostelImage._id)
            await reletedHostel.save()

            return res.status(201).json({
                "success": true,
                "message": "hostel image added successfull",
                "data": createdHostelImage
            })
        } else {
            return res.status(404).json({
                "success": false,
                "message": "hostel image not added",
            })
        }

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": error.message,
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