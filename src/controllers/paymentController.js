const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
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

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to pay for this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot pay for cancelled booking",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Booking already paid",
      });
    }

    // Simulated Payment Processing
    const transactionId = "TXN-" + Date.now();

    const payment = await Payment.create({
      bookingId,
      amount: booking.totalAmount,
      paymentMethod,
      transactionId,
      paymentStatus: "success",
    });

    // Update booking
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    await Notification.create({
      userId: booking.userId,
      eventId: booking.eventId,
      message: "Your payment was successful. Booking confirmed.",
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
  GET MY PAYMENTS (User)
*/
exports.getMyPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });
    const bookingIds = bookings.map((b) => b._id);

    const payments = await Payment.find({
      bookingId: { $in: bookingIds },
      paymentStatus: "success",
    })
      .populate("bookingId")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ORGANIZER - GET PAYMENTS FOR MY EVENTS
*/
exports.getOrganizerPayments = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id });
    const eventIds = events.map((e) => e._id);

    const bookings = await Booking.find({
      eventId: { $in: eventIds },
    });

    const bookingIds = bookings.map((b) => b._id);

    const payments = await Payment.find({
      bookingId: { $in: bookingIds },
      paymentStatus: "success",
    })
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

/*
  ADMIN - GET ALL PAYMENTS
*/
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      paymentStatus: "success",
    })
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

/*
  ADMIN DASHBOARD - TOTAL REVENUE
*/
exports.getTotalRevenue = async (req, res) => {
  try {
    const payments = await Payment.find({
      paymentStatus: "success",
    });

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    res.json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};