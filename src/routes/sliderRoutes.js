const express = require("express");
const router = express.Router();

const {
  createSlider,
  getSliders,
  getAllSliders,
  updateSlider,
  deleteSlider,
} = require("../controllers/sliderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Public
router.get("/", getSliders);

// Admin
router.get("/all", protect, adminOnly, getAllSliders);

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createSlider
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateSlider
);

router.delete("/:id", protect, adminOnly, deleteSlider);

module.exports = router;