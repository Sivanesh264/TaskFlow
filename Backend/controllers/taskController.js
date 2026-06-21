// controllers/taskController.js
// ─────────────────────────────────────────────
// Task Controller: Full CRUD + Search/Filter/Sort
// All routes here are PROTECTED — req.user is always available
// ─────────────────────────────────────────────

const Task = require("../models/Task");

// ─── Create Task ──────────────────────────────
// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      user: req.user.id, // Automatically assign to logged-in user
      activityLog: [{ action: "created", details: `Task "${title}" was created` }],
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully!",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get All Tasks ────────────────────────────
// GET /api/tasks?status=pending&priority=high&search=fix&sortBy=dueDate&order=asc
// Supports: search, filter by status/priority, sort, pagination
const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    // ─── Build Query Filter ────────────────────
    // Start with: only this user's tasks
    const filter = { user: req.user.id };

    // Add status filter if provided
    if (status && status !== "all") {
      filter.status = status;
    }

    // Add priority filter if provided
    if (priority && priority !== "all") {
      filter.priority = priority;
    }

    // Add text search if provided (case-insensitive regex on title and description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ─── Build Sort Object ─────────────────────
    const validSortFields = ["createdAt", "updatedAt", "dueDate", "priority", "title"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    // ─── Pagination ────────────────────────────
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Run query and count in parallel for efficiency
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select("-activityLog"), // Exclude activity log from list view
      Task.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: tasks.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Dashboard Stats ──────────────────────
// GET /api/tasks/stats
const getStats = async (req, res, next) => {
  try {
    // MongoDB aggregation: groups and counts tasks in one query
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } }, // Only this user's tasks
      {
        $group: {
          _id: null, // Group everything together
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] },
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] },
          },
        },
      },
    ]);

    // Count overdue tasks (due date in the past and not completed)
    const overdue = await Task.countDocuments({
      user: req.user._id,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    const result = stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    };

    res.json({
      success: true,
      stats: { ...result, overdue, _id: undefined },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Task ──────────────────────────
// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id, // Ensures users can only access THEIR tasks
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// ─── Update Task ──────────────────────────────
// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    // First find the task to verify ownership
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Build activity log entry
    const changes = [];
    if (title && title !== task.title) changes.push(`title changed to "${title}"`);
    if (status && status !== task.status) changes.push(`status changed to "${status}"`);
    if (priority && priority !== task.priority) changes.push(`priority changed to "${priority}"`);

    // Update fields
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    if (changes.length > 0) {
      task.activityLog.push({
        action: "updated",
        details: changes.join(", "),
      });
    }

    await task.save();

    res.json({
      success: true,
      message: "Task updated successfully!",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Task ──────────────────────────────
// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // Only the owner can delete
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask, getStats };
