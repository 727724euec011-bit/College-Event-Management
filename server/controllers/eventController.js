const Event = require("../models/Event");

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
};

// Create a new event
const createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, poster, capacity } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            venue,
            poster,
            capacity
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create event",
            error: error.message
        });
    }
};
// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};
// Update an event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update event",
            error: error.message
        });
    }
};
module.exports = {
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent
};