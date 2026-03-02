const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  broadcastNotification,
} = require("../controllers/notificationController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Get my notifications
router.get("/", protect, getMyNotifications);

// Get unread count
router.get("/unread-count", protect, getUnreadCount);

// Mark single as read
router.put("/:id/read", protect, markAsRead);

// Mark all as read
router.put("/mark-all/read", protect, markAllAsRead);

// Delete notification
router.delete("/:id", protect, deleteNotification);

// Admin broadcast
router.post(
  "/broadcast",
  protect,
  authorizeRoles("admin"),
  broadcastNotification
);

module.exports = router;