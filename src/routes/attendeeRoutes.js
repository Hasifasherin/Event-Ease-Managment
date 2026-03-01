const express = require("express");
const router = express.Router();

const {
  createAttendees,
  getAttendeesByBooking,
  checkInAttendee,
} = require("../controllers/attendeeController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create attendees (User)
router.post("/", protect, createAttendees);

// Get attendees by booking
router.get("/:bookingId", protect, getAttendeesByBooking);

// Check-in attendee (Organizer/Admin)
router.put(
  "/checkin/:id",
  protect,
  authorizeRoles("organizer", "admin"),
  checkInAttendee
);

module.exports = router;