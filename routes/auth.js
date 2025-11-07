const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { registerUser, loginUser, mobileLogin, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const User = require("../models/user"); // adjust case if needed (User.js or user.js)

// ==============================
// 🔹 REGISTER (email)
// ==============================
router.post("/register", registerUser);

// ==============================
// 🔹 LOGIN (email)
// ==============================
router.post("/login", loginUser);

// ==============================
// 🔹 MOBILE LOGIN / AUTO REGISTER
// ==============================
router.post("/mobile-login", mobileLogin);

// ==============================
// 🔹 GET PROFILE (protected)
// ==============================
router.get("/profile", protect, getUserProfile);

// ==============================
// 🔹 FORGOT PASSWORD (send reset email)
// ==============================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token valid for 15 minutes
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Create frontend reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Setup Nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset.\n\nClick below link to reset your password:\n${resetLink}\n\nThis link expires in 15 minutes.`,
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error sending password reset email." });
  }
});

module.exports = router;
