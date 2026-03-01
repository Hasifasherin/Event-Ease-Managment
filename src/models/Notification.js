const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["booking", "payment", "event_update", "reminder"],
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "read"],
      default: "sent",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);