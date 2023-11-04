const mongoose = require("mongoose")

AminitesSchema = new mongoose.Schema({
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
    },
    liftFacility: Boolean,
    wifiFacility: Boolean,
    gymFacility: Boolean,
    acFacility: Boolean,
    gamingRoom: Boolean,
    freeLaundry: Boolean,
    securityGuard: Boolean,
    filterWater: Boolean,
    cctv: Boolean,
    cleaning: Boolean,   
})

module.exports = mongoose.model("Aminities", AminitesSchema)