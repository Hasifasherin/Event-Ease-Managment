const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    time: String,
    location: String,
    eventType: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    bannerImage: String,
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);