// config/db.js
// ─────────────────────────────────────────────
// MongoDB connection using Mongoose
// Called once when the server starts
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("URI Loaded:", process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options ensure stable connections in production
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the process with failure so the server doesn't run without a DB
    process.exit(1);
  }
};

module.exports = connectDB;
