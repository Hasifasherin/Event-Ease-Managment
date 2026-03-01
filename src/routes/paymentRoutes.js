const express = require("express");
const router = express.Router();

const {
  makePayment,
  getMyPayments,
  getAllPayments,
} = require("../controllers/paymentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// User makes payment
router.post("/", protect, makePayment);

// User get own payments
router.get("/my-payments", protect, getMyPayments);

// Admin get all payments
router.get("/", protect, authorizeRoles("admin"), getAllPayments);

module.exports = router;