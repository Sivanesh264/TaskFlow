// controllers/authController.js
// ─────────────────────────────────────────────
// Authentication Controller
// Handles: Register, Login, Get Profile
//
// Controllers contain the BUSINESS LOGIC for each route.
// They receive (req, res, next) and send back a response.
// ─────────────────────────────────────────────

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─── Register ────────────────────────────────
// POST /api/auth/register
// Creates a new user account
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Create new user (password is auto-hashed by the pre-save hook in User model)
    const user = await User.create({ name, email, password });

    // Generate a JWT token for immediate login after registration
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

// ─── Login ────────────────────────────────────
// POST /api/auth/login
// Authenticates existing user and returns token
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user AND include the password field (it's hidden by default with select:false)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // Use a generic message to avoid revealing whether an email exists
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare the plain text password with the stored hash
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Profile ──────────────────────────────
// GET /api/auth/profile  (Protected)
// Returns the currently logged-in user's data
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile ───────────────────────────
// PUT /api/auth/profile  (Protected)
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };
