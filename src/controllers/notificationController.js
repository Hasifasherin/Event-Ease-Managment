const Notification = require("../models/Notification");

/*
  CREATE NOTIFICATION (Internal use)
*/
exports.createNotification = async (data) => {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error("Notification Error:", error.message);
  }
};

/*
  GET MY NOTIFICATIONS
*/
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("eventId", "title date");

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  MARK AS READ
*/
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    notification.status = "read";
    await notification.save();

    res.json({ message: "Notification marked as read" });
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
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await notification.deleteOne();

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};