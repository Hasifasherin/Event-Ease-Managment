const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Only organizer can create event
router.post(
  "/create",
  protect,
  authorizeRoles("organizer"),
  (req, res) => {
    res.json({ message: "Event created (Week 2 setup working)" });
  }
);

// Only admin can delete event
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Event deleted (Week 2 setup working)" });
  }
);

// User, Organizer & Admin allowed
router.get(
  "/",
  protect,
  authorizeRoles("user", "organizer", "admin"),
  (req, res) => {
    res.json({ message: "Get events route working" });
  }
);

module.exports = router;