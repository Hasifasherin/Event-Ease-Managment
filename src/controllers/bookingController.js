const Booking = require("../models/Booking");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

/*
  CREATE BOOKING
  User only
*/
exports.createBooking = async (req, res) => {
  try {
    const { ticketId, quantity } = req.body;

    if (!ticketId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Valid ticket ID and quantity are required",
      });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.quantity < quantity) {
      return res.status(400).json({
        message: "Not enough tickets available",
      });
    }

    const totalAmount = ticket.price * quantity;

    const booking = await Booking.create({
      userId: req.user._id,
      eventId: ticket.eventId,
      ticketId,
      quantity,
      totalAmount,
      status: "confirmed",
      paymentStatus: "pending",
    });

    ticket.quantity -= quantity;
    await ticket.save();

    await Notification.create({
      userId: req.user._id,
      eventId: ticket.eventId,
      message: "Your booking has been created successfully.",
      type: "booking",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  CANCEL BOOKING
  Only booking owner
*/
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking already cancelled",
      });
    }

    const ticket = await Ticket.findById(booking.ticketId);

    if (ticket) {
      ticket.quantity += booking.quantity;
      await ticket.save();
    }

    booking.status = "cancelled";
    await booking.save();

    await Notification.create({
      userId: booking.userId,
      eventId: booking.eventId,
      message: "Your booking has been cancelled successfully.",
      type: "booking",
    });

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  GET MY BOOKINGS (User)
*/
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("eventId", "title date location")
      .populate("ticketId", "name type price")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  GET SINGLE BOOKING
  - User (owner)
  - Organizer (event owner)
  - Admin
*/
exports.getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("eventId")
      .populate("ticketId")
      .populate("userId", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Admin
    if (req.user.role === "admin") {
      return res.json(booking);
    }

    // User owner
    if (
      req.user.role === "user" &&
      booking.userId._id.toString() === req.user._id.toString()
    ) {
      return res.json(booking);
    }

    // Organizer owner
    if (req.user.role === "organizer") {
      const event = await Event.findById(booking.eventId);

      if (
        event &&
        event.organizerId.toString() === req.user._id.toString()
      ) {
        return res.json(booking);
      }
    }

    return res.status(403).json({
      message: "Not authorized to view this booking",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ORGANIZER - GET BOOKINGS FOR MY EVENTS
*/
exports.getOrganizerBookings = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id });

    const eventIds = events.map((e) => e._id);

    const bookings = await Booking.find({
      eventId: { $in: eventIds },
    })
      .populate("userId", "name email")
      .populate("eventId", "title")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ADMIN - GET ALL BOOKINGS
*/
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId", "title")
      .populate("ticketId", "name type")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};