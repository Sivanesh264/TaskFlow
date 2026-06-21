// routes/taskRoutes.js
// ─────────────────────────────────────────────
// Task Route Definitions
// ALL routes here are protected (require valid JWT)
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getStats,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const { validate, taskRules } = require("../middleware/validate");

// Apply 'protect' middleware to ALL task routes
// Every request to /api/tasks/* must include a valid JWT
router.use(protect);

// GET /api/tasks/stats  — Dashboard statistics
// Must be defined BEFORE /:id route to avoid "stats" being treated as an ID
router.get("/stats", getStats);

// GET    /api/tasks         → get all tasks (with search/filter/sort)
// POST   /api/tasks         → create new task
router.route("/").get(getTasks).post(taskRules, validate, createTask);

// GET    /api/tasks/:id     → get one task
// PUT    /api/tasks/:id     → update task
// DELETE /api/tasks/:id     → delete task
router
  .route("/:id")
  .get(getTask)
  .put(taskRules, validate, updateTask)
  .delete(deleteTask);

module.exports = router;
