const express = require("express");
const router = express.Router();

const {
  createBooking,
  cancelBooking,
  getMyBookings,
  getSingleBooking,
  getAllBookings,
} = require("../controllers/bookingController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create booking
router.post("/", protect, createBooking);

// Cancel booking
router.put("/:id/cancel", protect, cancelBooking);

// Get my bookings
router.get("/my-bookings", protect, getMyBookings);

// Get single booking
router.get("/:id", protect, getSingleBooking);

// Admin - get all bookings
router.get("/", protect, authorizeRoles("admin"), getAllBookings);

module.exports = router;