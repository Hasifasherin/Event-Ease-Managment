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

// 🔥 ADMIN - GET ALL BOOKINGS (PUT THIS FIRST)
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllBookings
);

// User create
router.post("/", protect, createBooking);

// Cancel booking
router.put("/:id/cancel", protect, cancelBooking);

// My bookings
router.get("/my-bookings", protect, getMyBookings);

// Organizer bookings
router.get(
  "/organizer",
  protect,
  authorizeRoles("organizer"),
  getOrganizerBookings
);

// Single booking (KEEP THIS LAST)
router.get("/:id", protect, getSingleBooking);

module.exports = router;