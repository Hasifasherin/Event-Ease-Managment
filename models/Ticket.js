const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    type: { type: String, enum: ["VIP", "General"], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    salesStartDate: Date,
    salesEndDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);