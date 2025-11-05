const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

// ✅ POST /api/auth/login - Login or Register using mobile number
router.post("/login", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    // ✅ Check if user exists
    let user = await User.findOne({ mobile });

    // ✅ If not, register new user automatically
    if (!user) {
      user = new User({
        name: "New User",
        mobile,
        email: `${mobile}@rubyofficial.com`, // placeholder email
        password: "mobilelogin", // placeholder password (you can skip password-based login)
      });
      await user.save();
    }

    // ✅ Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
