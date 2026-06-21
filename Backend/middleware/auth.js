// middleware/auth.js
// ─────────────────────────────────────────────
// JWT Authentication Middleware
//
// This middleware "guards" protected routes.
// It runs BEFORE the route handler and checks:
//   1. Is there a token in the request header?
//   2. Is that token valid and not expired?
//   3. Does the user it points to still exist?
//
// If all checks pass → attach user to req and continue
// If any fail → return 401 Unauthorized
// ─────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // JWT is sent in the Authorization header as: "Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token found → reject request
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in to continue.",
      });
    }

    // Verify the token using our secret key
    // jwt.verify() throws an error if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user still exists in the database
    // (handles the case where an account was deleted after the token was issued)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // Attach the user to the request object
    // Now any route handler can access req.user to know WHO is making the request
    req.user = user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // jwt.verify() throws:
    //   - JsonWebTokenError → invalid signature/malformed token
    //   - TokenExpiredError → token has expired
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { protect };
