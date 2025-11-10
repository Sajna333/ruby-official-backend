// routes/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { protect, admin } = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

/**
 * ✅ REGISTER a new user
 * POST /api/users/register
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "✅ User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
});

/**
 * ✅ LOGIN user
 * POST /api/users/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

/**
 * ✅ GET all users (ADMIN only)
 * GET /api/users
 */
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Fetch Users Error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
