// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllOrganizers,
  getAdminDashboard,
  toggleBlockUser,
  deleteUser
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/organizers", protect, adminOnly, getAllOrganizers);

router.patch("/users/:id/block", protect, adminOnly, toggleBlockUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);
module.exports = router;