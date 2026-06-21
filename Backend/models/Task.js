// models/Task.js
// ─────────────────────────────────────────────
// Defines the structure of a Task document in MongoDB.
// Each task belongs to a specific user (via ObjectId reference).
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: "Status must be pending, in-progress, or completed",
      },
      default: "pending",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    // ─── Relationship ─────────────────────────
    // This links each task to its owner.
    // "ref: 'User'" tells Mongoose which collection to look up for populate()
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Activity log for tracking changes
    activityLog: [
      {
        action: String,
        timestamp: { type: Date, default: Date.now },
        details: String,
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Index for faster queries ─────────────────
// When users filter tasks by status or priority, MongoDB can find them faster
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
