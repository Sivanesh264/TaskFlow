// server.js
// ─────────────────────────────────────────────
// Main Entry Point for the Express Server
//
// This file:
//  1. Loads environment variables
//  2. Connects to MongoDB
//  3. Creates the Express app with middleware
//  4. Registers all API routes
//  5. Starts listening on a port
// ─────────────────────────────────────────────

// Load .env variables FIRST before anything else
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// ─── Connect to Database ──────────────────────
connectDB();

const app = express();

// ─── Core Middleware ──────────────────────────

// CORS: Allows the frontend (different port/domain) to call this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json({ limit: "10kb" })); // Limit body size for security
app.use(express.urlencoded({ extended: true }));

// HTTP request logging in development (shows method, path, status, response time)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health Check ─────────────────────────────
// Simple route to verify the server is running
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────
// All authentication routes
app.use("/api/auth", require("./routes/authRoutes"));
// All task CRUD routes
app.use("/api/tasks", require("./routes/taskRoutes"));

// ─── Error Handling ───────────────────────────
// 404 handler: catches any request that didn't match a route above
app.use(notFound);
// Global error handler: catches all errors passed via next(error)
app.use(errorHandler);

// ─── Start Server ─────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV || "development"} mode
  📡 Listening on port ${PORT}
  🔗 Health check: http://localhost:${PORT}/api/health
  `);
});
