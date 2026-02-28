const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    checkInStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendee", attendeeSchema);