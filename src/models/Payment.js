const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "paypal", "cash"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);