const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

/*
  Create Ticket
  Only event owner organizer
*/
exports.createTicket = async (req, res) => {
  try {
    const { eventId, name, type, price, quantity } = req.body;

    if (!eventId || !name || !type || price == null || quantity == null) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (price < 0 || quantity < 0) {
      return res.status(400).json({
        message: "Price and quantity must be positive values",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only event owner can create ticket
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to add ticket to this event",
      });
    }

    // Optional: Prevent duplicate ticket type for same event
    const existingTicket = await Ticket.findOne({ eventId, type });
    if (existingTicket) {
      return res.status(400).json({
        message: "This ticket type already exists for this event",
      });
    }

    const ticket = await Ticket.create({
      eventId,
      name,
      type,
      price,
      quantity,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Get Tickets By Event
*/
exports.getTicketsByEvent = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      eventId: req.params.eventId,
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Get Single Ticket
*/
exports.getSingleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Update Ticket
*/
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const event = await Event.findById(ticket.eventId);

    // Admin OR event owner
    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update this ticket",
      });
    }

    // Validate price & quantity if updating
    if (req.body.price && req.body.price < 0) {
      return res.status(400).json({
        message: "Price must be positive",
      });
    }

    if (req.body.quantity && req.body.quantity < 0) {
      return res.status(400).json({
        message: "Quantity must be positive",
      });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  Delete Ticket
*/
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const event = await Event.findById(ticket.eventId);

    // Admin OR event owner
    if (
      req.user.role !== "admin" &&
      event.organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this ticket",
      });
    }

    await ticket.deleteOne();

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};