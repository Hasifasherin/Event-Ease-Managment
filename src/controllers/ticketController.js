const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

/*
  Create Ticket
  Only event owner organizer
*/
exports.createTicket = async (req, res) => {
  try {
    const { eventId, name, type, price, quantity } = req.body;

    if (!eventId || !name || !type || !price || !quantity) {
      return res.status(400).json({
        message: "All fields are required",
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
  Update Ticket (including quantity update)
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