const Notification = require("../models/Notification");
const User = require("../models/User");

/*
  INTERNAL CREATE NOTIFICATION
  (Safe reusable function)
*/
exports.createNotification = async (data) => {
  try {
    await Notification.create({
      userId: data.userId,
      eventId: data.eventId || null,
      message: data.message,
      type: data.type || "general",
      status: "unread",
    });
  } catch (error) {
    console.error("Notification Error:", error.message);
  }
};

/*
  GET MY NOTIFICATIONS (with pagination)
*/
exports.getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const notifications = await Notification.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("eventId", "title startDate")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments({
      userId: req.user._id,
    });

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  GET UNREAD COUNT (For Navbar Badge)
*/
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      status: "unread",
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  MARK SINGLE AS READ
*/
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.status = "read";
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  MARK ALL AS READ
*/
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, status: "unread" },
      { status: "read" }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  DELETE NOTIFICATION
*/
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await notification.deleteOne();

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ADMIN - BROADCAST NOTIFICATION
*/
exports.broadcastNotification = async (req, res) => {
  try {
    const { message, role } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let filter = {};
    if (role) {
      filter.role = role; // optional: send only to users/organizers
    }

    const users = await User.find(filter);

    const notifications = users.map((user) => ({
      userId: user._id,
      message,
      type: "broadcast",
      status: "unread",
    }));

    await Notification.insertMany(notifications);

    res.json({ message: "Broadcast sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};