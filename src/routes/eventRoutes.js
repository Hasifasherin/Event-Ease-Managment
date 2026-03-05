const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
} = require("../controllers/eventController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create event (Organizer only)
router.post("/", protect, authorizeRoles("organizer"), createEvent);

// Public routes
router.get("/", getEvents);

// Organizer own events
router.get(
  "/organizer/my-events",
  protect,
  authorizeRoles("organizer"),
  getOrganizerEvents
);

router.get("/:id", getSingleEvent);


// Update & Delete
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;