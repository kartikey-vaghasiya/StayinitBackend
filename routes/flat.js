const express = require("express")
const router = express.Router()

const { getFlat, getAllFlats, addFlat, updateFlat, deleteFlat, addFlatImages } = require("../controllers/flat")

router.post("/", addFlat)

router.get("/", getAllFlats)
router.get("/:id", getFlat)

router.patch("/:id", updateFlat)
router.delete("/:id", deleteFlat)

router.post("/flat-image", addFlatImages)

module.exports = router

