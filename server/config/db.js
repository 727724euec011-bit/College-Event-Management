const mongoose = require("mongoose");

const connectDB = async () => {
    while (mongoose.connection.readyState !== 1) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000
            });
            console.log("MongoDB connected successfully");
        } catch (error) {
            console.error("MongoDB connection failed:", error.message);
            console.error("Add this machine's IP address in MongoDB Atlas Network Access.");
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    }
};

module.exports = connectDB;