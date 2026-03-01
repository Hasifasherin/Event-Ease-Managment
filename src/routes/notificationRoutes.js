const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// Get my notifications
router.get("/", protect, getMyNotifications);

// Mark as read
router.put("/:id/read", protect, markAsRead);

// Delete notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;