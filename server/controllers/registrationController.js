const Registration = require("../models/Registration");
const Event = require("../models/Event");

const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({
                message: "Event ID is required"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const existingRegistration = await Registration.findOne({
            userId: req.user.id,
            eventId
        });

        if (existingRegistration) {
            return res.status(400).json({
                message: "Already registered for this event"
            });
        }

        const registrationCount =
            await Registration.countDocuments({ eventId });

        if (registrationCount >= event.capacity) {
            return res.status(400).json({
                message: "Event is full"
            });
        }

        const registration = await Registration.create({
            userId: req.user.id,
            eventId
        });

        res.status(201).json({
            message: "Event registration successful",
            registration
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({
            userId: req.user.id
        }).populate("eventId");

        res.status(200).json(registrations);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch registered events",
            error: error.message
        });
    }
};


const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate("userId", "name email")
            .populate("eventId", "title date venue");

        res.status(200).json(registrations);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch registrations",
            error: error.message
        });
    }
};


module.exports = {
    registerForEvent,
    getMyRegistrations,
    getAllRegistrations
};