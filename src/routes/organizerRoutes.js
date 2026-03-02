const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getMyEvents,
  getEventBookings,
} = require("../controllers/organizerController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Organizer only
router.get("/dashboard", protect, authorizeRoles("organizer"), getDashboard);
router.get("/my-events", protect, authorizeRoles("organizer"), getMyEvents);
router.get("/bookings", protect, authorizeRoles("organizer"), getEventBookings);

module.exports = router;