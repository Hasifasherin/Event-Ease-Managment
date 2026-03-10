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
const upload = require("../middleware/upload");

/* ================= PUBLIC ================= */
router.get("/", getEvents);
router.get("/:id", getSingleEvent);

/* ================= ORGANIZER ================= */
router.post(
  "/",
  protect,
  authorizeRoles("organizer"),
  upload.single("bannerImage"), // ✅ Image Upload
  createEvent
);

router.get(
  "/organizer/my-events",
  protect,
  authorizeRoles("organizer"),
  getOrganizerEvents
);

router.put(
  "/:id",
  protect,
  authorizeRoles("organizer"),
  upload.single("bannerImage"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("organizer"),
  deleteEvent
);

module.exports = router;