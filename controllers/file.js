const File = require("../models/File");
const cloudinary = require('cloudinary').v2


// Function: to upload file on local device
const localFileUpload = (req, res) => {

    // getting file from request
    const file = req.files.file;
    let path = __dirname + "../files/" + Date.now() + `.${file.name.split(".")[1]}`


    file.mv(path, (error) => {
        if (error) {
            return res.json({
                "success": false,
                "message": "error during moving file to server",
                "data": {}
            })
        } else {
            res.json({
                "success": true,
                "message": "File Uploaded Successfully",
                "data": {}
            })
        }
    })
}


// Function: to upload file to cloudinary's server
async function uploadToCloudinary(file, folder, quality) {

    // Options: specifing "Quality, Foldername and resource type"
    const options = { folder }
    if (quality) {
        options.quality = quality
    }
    options.resource_type = "auto"


    return cloudinary.uploader.upload(file.tempFilePath, options)
}


// Validations + Uploading in Clodinary using Function "uploadToCloudinary"
const cloudinaryUpload = async (req, res) => {
    // getting file from req
    const file = req.files.imageFile
    const { name, tags } = req.body

    // validation
    const typeArray = ['jpeg', 'png', 'jpg']
    if (!typeArray.includes(file.name.split('.')[1])) {
        return res.send({
            "success": false,
            "message": "invalid file type",
            "data": {}
        })
    }


    // uploading to cloudinary
    const result = await uploadToCloudinary(file, "Kartik")

    // creating entry in db
    const fileInDB = await File.create({
        name, url: result.secure_url, tags
    })

    //sending response
    res.json({
        "success": true,
        "message": "file uploaded succesfully",
        "data": fileInDB
    })
}

module.exports = {
    localFileUpload,
    cloudinaryUpload
}
