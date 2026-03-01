const Event = require("../models/Event");

/*
  Utility: Update Event Status Based on Date
*/
const getEventStatus = (startDate, endDate) => {
  const now = new Date();

  if (now < new Date(startDate)) return "upcoming";
  if (now >= new Date(startDate) && now <= new Date(endDate))
    return "ongoing";
  return "completed";
};

/*
  Create Event
  Only Organizer
*/
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      time,
      location,
      eventType,
      bannerImage,
    } = req.body;

    if (!title || !startDate || !endDate || !eventType) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const status = getEventStatus(startDate, endDate);

    const event = await Event.create({
      title,
      description,
      category,
      startDate,
      endDate,
      time,
      location,
      eventType,
      bannerImage,
      status,
      organizerId: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Get All Events (Public)
*/
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizerId", "name email role")
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Get Single Event
*/
exports.getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizerId",
      "name email role"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Update Event
  Organizer (own event) OR Admin
*/
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Authorization check
    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this event",
      });
    }

    // Recalculate status if dates are updated
    const startDate = req.body.startDate || event.startDate;
    const endDate = req.body.endDate || event.endDate;

    req.body.status = getEventStatus(startDate, endDate);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Delete Event
  Organizer (own event) OR Admin
*/
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Authorization check
    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this event",
      });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};