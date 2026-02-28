const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    startDate: Date,
    endDate: Date,
    time: String,
    location: String,
    eventType: { type: String, enum: ["online", "offline"] },
    bannerImage: String,
    status: { type: String, default: "upcoming" },

    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);