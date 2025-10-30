const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

/**
 * Middleware to protect routes — verifies JWT and attaches user to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({ error: "Not authorized, token missing" });
    }

    // ✅ Verify token and get user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user from DB (without password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please log in again" });
    }

    res.status(401).json({ error: "Token invalid or unauthorized" });
  }
};

/**
 * Middleware for admin-only access
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: "Access denied, admin only" });
  }
};

module.exports = { protect, admin };
