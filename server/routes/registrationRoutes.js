const express = require("express");

const {
    registerForEvent,
    getMyRegistrations,
    getAllRegistrations
} = require("../controllers/registrationController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Student: register for an event
router.post("/", protect, registerForEvent);

// Student: view my registered events
router.get("/my", protect, getMyRegistrations);

// Admin: view all registrations
router.get("/all", protect, adminOnly, getAllRegistrations);

module.exports = router;