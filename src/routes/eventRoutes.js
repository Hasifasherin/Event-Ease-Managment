const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create → Only Organizer
router.post("/", protect, authorizeRoles("organizer"), createEvent);

// Public routes
router.get("/", getEvents);
router.get("/:id", getSingleEvent);

// Update → Protected (controller decides organizer/admin)
router.put("/:id", protect, updateEvent);

// Delete → Protected (controller decides organizer/admin)
router.delete("/:id", protect, deleteEvent);

module.exports = router;