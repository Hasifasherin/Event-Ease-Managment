const express = require("express");
const router = express.Router();
const {
  createAttendees,
  getAttendeesByBooking,
  checkInAttendee,
  getEventAttendees,
} = require("../controllers/attendeeController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, createAttendees);

router.get("/:bookingId", protect, getAttendeesByBooking);

// NEW
router.get(
  "/event/:eventId",
  protect,
  authorizeRoles("organizer", "admin"),
  getEventAttendees
);

router.put(
  "/checkin/:id",
  protect,
  authorizeRoles("organizer", "admin"),
  checkInAttendee
);
module.exports = router;