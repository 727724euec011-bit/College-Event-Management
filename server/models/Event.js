const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            required: true
        },

        venue: {
            type: String,
            required: true,
            trim: true
        },

        poster: {
            type: String,
            default: ""
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);