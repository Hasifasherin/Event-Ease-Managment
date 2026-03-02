const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    image: { type: String, required: true },
    cloudinaryId: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", sliderSchema);