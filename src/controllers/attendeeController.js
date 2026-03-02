const Attendee = require("../models/Attendee");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

/*
  Create Attendees for a Booking
  User only (booking owner)
*/
exports.createAttendees = async (req, res) => {
  try {
    const { bookingId, attendees } = req.body;

    if (!bookingId || !attendees || attendees.length === 0) {
      return res.status(400).json({
        message: "Booking ID and attendees are required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only booking owner
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // Prevent over-adding attendees
    if (attendees.length !== booking.quantity) {
      return res.status(400).json({
        message: `You must add exactly ${booking.quantity} attendees`,
      });
    }

    const createdAttendees = await Attendee.insertMany(
      attendees.map((a) => ({
        bookingId,
        name: a.name,
        email: a.email,
      }))
    );

    res.status(201).json(createdAttendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Get Attendees by Booking
  - User (booking owner)
  - Organizer (event owner)
  - Admin
*/
exports.getAttendeesByBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Admin allowed
    if (req.user.role === "admin") {
      const attendees = await Attendee.find({
        bookingId: req.params.bookingId,
      });
      return res.json(attendees);
    }

    // Booking owner allowed
    if (
      req.user.role === "user" &&
      booking.userId.toString() === req.user._id.toString()
    ) {
      const attendees = await Attendee.find({
        bookingId: req.params.bookingId,
      });
      return res.json(attendees);
    }

    // Organizer must own event
    if (req.user.role === "organizer") {
      const event = await Event.findById(booking.eventId);

      if (
        event &&
        event.organizerId.toString() === req.user._id.toString()
      ) {
        const attendees = await Attendee.find({
          bookingId: req.params.bookingId,
        });
        return res.json(attendees);
      }
    }

    return res.status(403).json({ message: "Not authorized" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Organizer - Get All Attendees for an Event
*/
exports.getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only event owner or admin
    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bookings = await Booking.find({ eventId: event._id });

    const bookingIds = bookings.map((b) => b._id);

    const attendees = await Attendee.find({
      bookingId: { $in: bookingIds },
    }).populate("bookingId");

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Check-In Attendee (Organizer/Admin)
*/
exports.checkInAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id).populate(
      "bookingId"
    );

    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    const booking = attendee.bookingId;
    const event = await Event.findById(booking.eventId);

    // Admin allowed
    if (req.user.role === "admin") {
      attendee.checkInStatus = true;
      await attendee.save();
      return res.json({
        message: "Attendee checked in successfully",
        attendee,
      });
    }

    // Organizer must own event
    if (
      req.user.role === "organizer" &&
      event.organizerId.toString() === req.user._id.toString()
    ) {
      attendee.checkInStatus = true;
      await attendee.save();

      return res.json({
        message: "Attendee checked in successfully",
        attendee,
      });
    }

    return res.status(403).json({ message: "Not authorized" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};