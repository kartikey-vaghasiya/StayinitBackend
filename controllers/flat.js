const Flat = require("../models/Flat")
const Image = require("../models/Image")

async function getFlat(req, res) {
    try {
        // Get Id
        const { id } = req.params

        // Get Flat From DB Using ID
        const data = await Flat.findById(id).populate("arrayOfImages")
        console.log(data)
        try {
            res.status(200).json({
                "success": true,
                "message": "Get Request Successful",
                "data": data
            })
        } catch (e) {
            res.status(404).json({
                "success": false,
                "error": e.message,
                "data": {}
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

async function getAllFlats(req, res) {
    try {

        const { bhk, sqft, furnitureType } = req.query

        const minPrice = req.query.minPrice || 0
        const maxPrice = req.query.maxPrice || Infinity
        const minSqft = req.query.minSqft || 0
        const maxSqft = req.query.maxSqft || Infinity
        const sortByPrice = req.query.sortByPrice;
        const sortBySqft = req.query.sortBySqft;

        queryObj = {}

        if (bhk) {
            queryObj.property_bhk = bhk
        }

        if (furnitureType) {
            queryObj.furnitureType = furnitureType
        }

        // Get queryed data
        const data = await Flat.find(queryObj)
            .populate("arrayOfImages")
            .sort(
                sortByPrice ?
                    {
                        "property_price": sortByPrice
                    }
                    :
                    sortBySqft ?
                        {
                            "property_sqft": sortBySqft
                        }
                        :
                        null
            )
            .where("property_price").gt(minPrice).lt(maxPrice)
            .where("property_sqft").gt(minSqft).lt(maxSqft)
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
                "error": "Flats Not Found",
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

async function addFlat(req, res) {
    try {
        // Get Flat Data From Request
        const {
            property_name,
            property_price,
            property_bhk,
            property_sqft,
            property_devloper,
            property_locality,
            property_city,
            atWhichFloor,
            totalFloor,
            nearestLandmark,
            description,
            num_of_baths,
            num_of_balconies,
            furnitureType,
            arrayOfImages,
            locality_url,
            address,
            contactNum,
            contactMail
        } = req.body

        // Create Flat Object
        const flat = new Flat({
            property_name,
            property_price,
            property_bhk,
            property_sqft,
            property_devloper,
            property_locality,
            property_city,
            atWhichFloor,
            totalFloor,
            nearestLandmark,
            description,
            num_of_baths,
            num_of_balconies,
            furnitureType,
            arrayOfImages,
            locality_url,
            address,
            contactNum,
            contactMail
        })

        flat.save()
            .then((Flat_data) => {
                res.status(201).json({
                    "success": true,
                    "message": "Flat created successfully",
                    "data": Flat_data
                })
            })
            .catch((e) => {
                res.status(500).json({
                    "success": false,
                    "error": e,
                    "data": {}
                })
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

async function deleteFlat(req, res) {
    try {
        // Get Id
        const { id } = req.params

        // Get Flat From DB Using ID
        Flat.findByIdAndDelete(id)
            .then((deletedFlat) => {
                res.status(200).json({
                    "success": true,
                    "message": "Flat Deleted Successfuly",
                    "data": deletedFlat
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

async function updateFlat(req, res) {
    try {
        // Get Id
        const { id } = req.params
        const {
            property_name,
            property_price,
            property_bhk,
            property_sqft,
            property_devloper,
            property_locality,
            property_city,
            atWhichFloor,
            totalFloor,
            nearestLandmark,
            description,
            num_of_baths,
            num_of_balconies,
            furnitureType,
            locality_url,
            address,
            contactNum,
            contactMail
        } = req.body

        const updatedFlat = {
            property_name,
            property_price,
            property_bhk,
            property_sqft,
            property_devloper,
            property_locality,
            property_city,
            atWhichFloor,
            totalFloor,
            nearestLandmark,
            description,
            num_of_baths,
            num_of_balconies,
            furnitureType,
            locality_url,
            address,
            contactNum,
            contactMail
        }

        // Get Flat From DB Using ID
        Flat.findByIdAndUpdate(id, updatedFlat, { new: true, runValidators: true })
            .then((EditedFlat) => {
                res.status(200).json({
                    "success": true,
                    "message": "Flat Updated Successfuly",
                    "data": EditedFlat
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

async function addFlatImages(req, res) {
    try {
        const {
            url,
            flatOrHostelId,
            tags,
        } = req.body


        let flatImages = new Image({
            url,
            flatOrHostelId,
            tags,
        })

        // Creating entry in DB
        const createdFlatImage = await flatImages.save()


        const reletedFlat = await Flat.findOne({ _id: flatOrHostelId })
        reletedFlat.arrayOfImages.push(createdFlatImage._id)
        await reletedFlat.save()


        if (createdFlatImage) {
            res.status(201).json({
                "success": true,
                "message": "Image Added Successfully",
                "data": createdFlatImage
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
    getFlat,
    getAllFlats,
    addFlat,
    deleteFlat,
    updateFlat,
    addFlatImages
}