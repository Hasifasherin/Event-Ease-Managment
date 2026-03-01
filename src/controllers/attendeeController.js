const Attendee = require("../models/Attendee");
const Booking = require("../models/Booking");

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
*/
exports.getAttendeesByBooking = async (req, res) => {
  try {
    const attendees = await Attendee.find({
      bookingId: req.params.bookingId,
    });

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
    const attendee = await Attendee.findById(req.params.id);

    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    attendee.checkInStatus = true;
    await attendee.save();

    res.json({
      message: "Attendee checked in successfully",
      attendee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};