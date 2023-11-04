const express = require("express")
const Router = express.Router()

const AuthMiddlewere = require("../middleweres/auth")

const { getFlat, getAllFlats, addFlat, updateFlat, deleteFlat, addFlatImages } = require("../controllers/flat")

Router.get("/", getAllFlats)
Router.get("/:id", getFlat)

Router.post("/", addFlat)
Router.put("/:id", updateFlat)
Router.delete("/:id", deleteFlat)

Router.post("/flat-image", addFlatImages)




module.exports = Router


// Need to imporve flatimage insertion 