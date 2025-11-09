// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  registerUser,
  loginUser,
  mobileLogin,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const User = require("../models/user");
require("dotenv").config();

/* ================================================
   🔹 REGISTER (EMAIL)
   POST /api/auth/register
   Public
================================================ */
router.post("/register", registerUser);

/* ================================================
   🔹 LOGIN (EMAIL)
   POST /api/auth/login
   Public
================================================ */
router.post("/login", loginUser);

/* ================================================
   🔹 MOBILE LOGIN / AUTO REGISTER
   POST /api/auth/mobile-login
   Public
================================================ */
router.post("/mobile-login", mobileLogin);

/* ================================================
   🔹 GET PROFILE
   GET /api/auth/profile
   Protected
================================================ */
router.get("/profile", protect, getUserProfile);

/* ================================================
   🔹 FORGOT PASSWORD (EMAIL RESET)
   POST /api/auth/forgot-password
   Public
================================================ */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate short-lived JWT token (15 minutes)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "defaultsecret", {
      expiresIn: "15m",
    });

    // ✅ Create frontend reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // ✅ Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    // ✅ Send email
    const mailOptions = {
      from: `"Ruby Official" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset Request</h3>
        <p>You requested to reset your password for <b>${user.email}</b>.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p><b>Note:</b> This link expires in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "✅ Password reset link sent to your email." });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error.message);
    res.status(500).json({ message: "Failed to send password reset email." });
  }
});

/* ================================================
   🔹 RESET PASSWORD (optional backend endpoint)
   POST /api/auth/reset-password/:token
   Public
================================================ */
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found or token invalid" });
    }

    // Hash new password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "✅ Password reset successful. You can now log in." });
  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);
    res.status(400).json({ message: "Invalid or expired token." });
  }
});

module.exports = router;
