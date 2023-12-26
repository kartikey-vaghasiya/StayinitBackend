const File = require("../models/File");
const cloudinary = require('cloudinary').v2

const localFileUpload = (req, res) => {

    const file = req.files.file;
    let path = __dirname + "../files/" + Date.now() + `.${file.name.split(".")[1]}`


    file.mv(path, (error) => {
        if (error) {
            return res.status(500).json({
                "success": false,
                "message": error.message,
            })
        } else {
            return res.json({
                "success": true,
                "message": "file uploaded succesfully",
                "data": { name: file.name, path: path }
            })
        }
    })
}

async function uploadToCloudinary(file, folder, quality) {

    // Options: "Quality", "Foldername" and "Resource type"
    const options = { folder }
    quality ? options.quality = quality : null
    options.resource_type = "auto"

    return cloudinary.uploader.upload(file.tempFilePath, options)
}

async function cloudinaryUpload(req, res) {

    try {
        const file = req.files.imageFile
        const { name, tags } = req.body

        const typeArray = ['jpeg', 'png', 'jpg']

        if (!typeArray.includes(file.name.split('.')[1])) {
            return res.send({
                success: false,
                message: 'invalid file type'
            })
        }

        const result = await uploadToCloudinary(file, "kartik")

        const fileInDB = await File.create({
            name, url: result.secure_url, tags
        })

        res.json({
            "success": true,
            "message": "file uploaded succesfully",
            "data": fileInDB
        })
    } catch (error) {
        return res.status(500).json({
            "success": false,
            "message": error.message,
        })
    }
}

module.exports = {
    localFileUpload,
    cloudinaryUpload
}
