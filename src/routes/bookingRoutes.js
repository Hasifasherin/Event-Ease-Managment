const express = require("express");
const router = express.Router();

const {
  createBooking,
  cancelBooking,
  getMyBookings,
  getSingleBooking,
  getAllBookings,
  getOrganizerBookings,
} = require("../controllers/bookingController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

/* ================= BOOKINGS ================= */

//  ADMIN - GET ALL BOOKINGS (keep this first)
router.get("/", protect, authorizeRoles("admin"), getAllBookings);

// User create booking
router.post("/", protect, createBooking);

// Cancel booking
router.put("/:id/cancel", protect, cancelBooking);

// Get my bookings (user)
router.get("/my-bookings", protect, getMyBookings);

// Organizer bookings
router.get("/organizer", protect, authorizeRoles("organizer"), getOrganizerBookings);

// Get single booking (keep this last)
router.get("/:id", protect, getSingleBooking);

module.exports = router;