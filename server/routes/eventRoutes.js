const express = require("express");
const {
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent
} = require("../controllers/eventController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getEvents);
router.post("/", protect, adminOnly, createEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);
router.put("/:id", protect, adminOnly, updateEvent);

module.exports = router;