// middleware/errorHandler.js
// ─────────────────────────────────────────────
// Global Error Handling Middleware
//
// Express identifies this as error-handling middleware
// because it has 4 parameters: (err, req, res, next)
//
// Any time you call next(error) from a route, Express
// skips to this handler automatically.
// ─────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console in development (helps with debugging)
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  // ─── Mongoose: Invalid ObjectId ────────────
  // Happens when someone passes a malformed ID like /tasks/abc123
  if (err.name === "CastError") {
    error = {
      statusCode: 404,
      message: "Resource not found",
    };
  }

  // ─── Mongoose: Duplicate Key ────────────────
  // Happens when trying to register with an email that already exists
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      statusCode: 400,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    };
  }

  // ─── Mongoose: Validation Error ─────────────
  // Happens when a required field is missing or a value fails a validator
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = {
      statusCode: 400,
      message: messages.join(". "),
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler for unknown routes
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
