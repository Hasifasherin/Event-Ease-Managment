const Event = require("../models/Event");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

/*
  ORGANIZER DASHBOARD
*/
exports.getDashboard = async (req, res) => {
  try {
    const organizerId = req.user._id;

    // Get organizer events
    const events = await Event.find({ organizerId }).sort({ createdAt: -1 });
    const eventIds = events.map((e) => e._id);

    // Total events
    const totalEvents = events.length;

    // Total bookings
    const totalBookings = await Booking.countDocuments({
      eventId: { $in: eventIds },
    });

    // Get recent bookings
    const bookings = await Booking.find({
      eventId: { $in: eventIds },
    })
      .populate("userId", "name email")
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Total revenue
    const payments = await Payment.find()
      .populate({
        path: "bookingId",
        match: { eventId: { $in: eventIds } },
      });

    let totalRevenue = 0;

    payments.forEach((payment) => {
      if (payment.bookingId) {
        totalRevenue += payment.amount;
      }
    });

    res.json({
      stats: {
        totalEvents,
        totalBookings,
        totalRevenue,
      },
      events,
      bookings,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  GET MY EVENTS
*/
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizerId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  GET BOOKINGS FOR MY EVENTS
*/
exports.getEventBookings = async (req, res) => {
  try {
    const events = await Event.find({
      organizerId: req.user._id,
    });

    const eventIds = events.map((e) => e._id);

    const bookings = await Booking.find({
      eventId: { $in: eventIds },
    })
      .populate("userId", "name email")
      .populate("eventId", "title date");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};