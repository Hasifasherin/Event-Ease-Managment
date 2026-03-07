const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    subtitle: {
      type: String,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", sliderSchema);