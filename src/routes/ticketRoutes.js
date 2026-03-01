const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTicketsByEvent,
  getSingleTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create ticket (Organizer only)
router.post("/", protect, authorizeRoles("organizer"), createTicket);

// Get tickets by event (Public)
router.get("/event/:eventId", getTicketsByEvent);

// Get single ticket
router.get("/:id", getSingleTicket);

// Update ticket
router.put("/:id", protect, updateTicket);

// Delete ticket
router.delete("/:id", protect, deleteTicket);

module.exports = router;