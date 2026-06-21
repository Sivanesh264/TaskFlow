// routes/authRoutes.js
// ─────────────────────────────────────────────
// Auth Route Definitions
// Maps HTTP methods + paths → controller functions
// Also applies middleware (validation, auth protection)
// ─────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const { register, login, getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validate, registerRules, loginRules } = require("../middleware/validate");

// POST /api/auth/register
// registerRules → validate → register controller
// Middleware runs LEFT to RIGHT: validate input, then create user
router.post("/register", registerRules, validate, register);

// POST /api/auth/login
router.post("/login", loginRules, validate, login);

// GET /api/auth/profile  (🔒 Protected)
// protect middleware checks JWT before allowing access
router.get("/profile", protect, getProfile);

// PUT /api/auth/profile  (🔒 Protected)
router.put("/profile", protect, updateProfile);

module.exports = router;
