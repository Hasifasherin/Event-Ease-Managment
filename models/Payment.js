const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: String,
    transactionId: String,
    paymentStatus: { type: String, default: "pending" },
    paymentDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);