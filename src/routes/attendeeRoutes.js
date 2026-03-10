const express = require("express");
const router = express.Router();
const {
  getAttendeesByBooking,
  checkInAttendee,
  getEventAttendees,
} = require("../controllers/attendeeController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

/* ================= ATTENDEE ROUTES ================= */

// Get attendees for a specific booking (User/Admin/Organizer)
router.get("/:bookingId", protect, getAttendeesByBooking);

// Get all attendees for an event (Organizer/Admin)
router.get(
  "/event/:eventId",
  protect,
  authorizeRoles("organizer", "admin"),
  getEventAttendees
);

// Check-in attendee (Organizer/Admin)
router.put(
  "/checkin/:id",
  protect,
  authorizeRoles("organizer", "admin"),
  checkInAttendee
);

module.exports = router;