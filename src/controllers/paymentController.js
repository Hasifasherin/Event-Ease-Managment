const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

/*
  MAKE PAYMENT
  User only
*/
exports.makePayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        message: "Booking ID and payment method are required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only booking owner can pay
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to pay for this booking",
      });
    }

    // Cannot pay cancelled booking
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot pay for a cancelled booking",
      });
    }

    // Prevent duplicate payment
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Booking already paid",
      });
    }

    const transactionId = "TXN" + Date.now();

    const payment = await Payment.create({
      bookingId,
      amount: booking.totalAmount,
      paymentMethod,
      transactionId,
      paymentStatus: "success", // simulate success
    });

    // Update booking payment status
    booking.paymentStatus = "paid";
    await booking.save();

    // 🔔 Create notification after successful payment
    await Notification.create({
      userId: booking.userId,
      eventId: booking.eventId,
      message: "Your payment was successful. Booking is now confirmed.",
      type: "payment",
    });

    res.status(201).json({
      message: "Payment successful",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  GET MY PAYMENTS
*/
exports.getMyPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });
    const bookingIds = bookings.map((b) => b._id);

    const payments = await Payment.find({
      bookingId: { $in: bookingIds },
    })
      .populate("bookingId")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ADMIN - GET ALL PAYMENTS
*/
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "bookingId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};