const express = require("express");
const router = express.Router();

const {
  makePayment,
  getMyPayments,
  getAllPayments,
  getOrganizerPayments,
  getTotalRevenue,
} = require("../controllers/paymentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// User makes payment
router.post("/", protect, makePayment);

// User payments
router.get("/my-payments", protect, getMyPayments);

// Organizer payments
router.get(
  "/organizer",
  protect,
  authorizeRoles("organizer"),
  getOrganizerPayments
);

// Admin revenue
router.get(
  "/revenue",
  protect,
  authorizeRoles("admin"),
  getTotalRevenue
);

// Admin get all payments
router.get("/", protect, authorizeRoles("admin"), getAllPayments);

module.exports = router;