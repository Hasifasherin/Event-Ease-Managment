// controllers/adminController.js

const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

/*
  ADMIN - GET ALL USERS
*/
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ADMIN - GET ALL ORGANIZERS
*/
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: "organizer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(organizers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ADMIN DASHBOARD STATS
*/
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrganizers = await User.countDocuments({ role: "organizer" });
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalPayments = await Payment.countDocuments();

    // ✅ Total Revenue (only successful payments)
    const revenueData = await Payment.aggregate([
      { $match: { paymentStatus: "success" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // ✅ Recent Bookings
    const recentBookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // ✅ Recent Events
    const recentEvents = await Event.find()
      .populate("organizerId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalOrganizers,
        totalEvents,
        totalBookings,
        totalPayments,
        totalRevenue,
      },
      recentBookings,
      recentEvents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};