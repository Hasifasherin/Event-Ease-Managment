const Event = require("../models/Event");
const Booking = require("../models/Booking");

/*
  Utility: Get Event Status Based on Date
*/
const getEventStatus = (startDate, endDate) => {
  const now = new Date();

  if (now < new Date(startDate)) return "upcoming";
  if (now >= new Date(startDate) && now <= new Date(endDate))
    return "ongoing";
  return "completed";
};

/*
  CREATE EVENT
  Organizer Only
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
  GET ALL EVENTS (Public + Filters + Search + Pagination)
*/
exports.getEvents = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const events = await Event.find(query)
      .populate("organizerId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  GET SINGLE EVENT
*/
exports.getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizerId",
      "name email"
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
  GET ORGANIZER EVENTS
*/
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({
      organizerId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  UPDATE EVENT
  Organizer (own event) OR Admin
*/
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this event",
      });
    }

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
  DELETE EVENT
  Organizer (own event) OR Admin
*/
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this event",
      });
    }

    // 🚨 Prevent delete if bookings exist
    const bookings = await Booking.find({ eventId: event._id });

    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Cannot delete event with existing bookings",
      });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};