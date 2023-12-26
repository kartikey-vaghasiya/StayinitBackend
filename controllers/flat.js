const Flat = require("../models/Flat")
const Image = require("../models/Image")

async function getFlat(req, res) {
    try {
        const { id } = req.params

        const data = await Flat.findById(id).populate("arrayOfImages")
        try {
            res.status(200).json({
                "success": true,
                "message": "flat fetched successfully",
                "data": data
            })
        } catch (error) {
            res.status(404).json({
                "success": false,
                "error": error.message,
            })
        }

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }

}

async function getAllFlats(req, res) {
    try {

        const { bhk, furnitureType } = req.query

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
            return res.status(200).json({
                "success": true,
                "message": "flat fetched successfully",
                "data": data
            })
        } else {
            return res.status(404).json({
                "success": false,
                "error": "flat not found",
            })
        }

    } catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function addFlat(req, res) {
    try {
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
                    "message": "flat added successfull",
                    "data": Flat_data
                })
            })
            .catch((error) => {
                res.status(500).json({
                    "success": false,
                    "error": error.message,
                })
            })
    }
    catch (error) {
        res.status(500).json({
            "success": false,
            "error": error.message,
        })
    }
}

async function deleteFlat(req, res) {
    try {
        const { id } = req.params

        Flat.findByIdAndDelete(id)
            .then((deletedFlat) => {
                res.status(200).json({
                    "success": true,
                    "message": "flat deleted successfully",
                    "data": deletedFlat
                })
            })
            .catch((error) => {
                res.status(404).json({
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

async function updateFlat(req, res) {
    try {
        const { id } = req.params

        Flat.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .then((EditedFlat) => {
                res.status(200).json({
                    "success": true,
                    "message": "flat updated successfully",
                    "data": EditedFlat
                })
            })
            .catch((error) => {
                res.status(404).json({
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

        const createdFlatImage = await flatImages.save()

        if (createdFlatImage) {


            const reletedFlat = await Flat.findOne({ _id: flatOrHostelId })
            reletedFlat.arrayOfImages.push(createdFlatImage._id)
            await reletedFlat.save()

            res.status(201).json({
                "success": true,
                "message": "image added successfull",
                "data": createdFlatImage
            })
        } else {
            res.status(404).json({
                "success": false,
                "message": "image not added",
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
    getFlat,
    getAllFlats,
    addFlat,
    deleteFlat,
    updateFlat,
    addFlatImages
}