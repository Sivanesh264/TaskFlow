// models/User.js
// ─────────────────────────────────────────────
// Defines the structure of a User document in MongoDB.
// Mongoose converts this JS object into a MongoDB schema.
// ─────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // No two users can have the same email
      trim: true,
      lowercase: true, // Always store email in lowercase
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never return password in queries by default
    },
    avatar: {
      type: String,
      default: "", // Optional profile picture URL
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// ─── Pre-save Hook ───────────────────────────
// Runs BEFORE every .save() call.
// Hashes the password so we NEVER store plain text passwords.
userSchema.pre("save", async function (next) {
  // Only hash the password if it was actually changed (not on other updates)
  if (!this.isModified("password")) return next();

  // bcrypt salt rounds: 12 means strong security but slightly slower
  // Higher = more secure but slower. 10-12 is the industry standard.
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method ─────────────────────────
// Custom method we can call on any user document: user.comparePassword(...)
// Returns true if the given password matches the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
