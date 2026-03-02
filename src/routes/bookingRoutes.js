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

router.post("/", protect, createBooking);

router.put("/:id/cancel", protect, cancelBooking);

router.get("/my-bookings", protect, getMyBookings);

// NEW - Organizer bookings
router.get(
  "/organizer",
  protect,
  authorizeRoles("organizer"),
  getOrganizerBookings
);

router.get("/:id", protect, getSingleBooking);

router.get("/", protect, authorizeRoles("admin"), getAllBookings);

module.exports = router;