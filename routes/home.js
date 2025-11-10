const express = require("express");
const router = express.Router();
const Product = require("../models/products");

// GET / — display all electronics kits on homepage
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(6); // show 6 latest
    res.status(200).json(products); // ✅ return JSON instead of rendering view
  } catch (err) {
    console.error("Failed to load homepage:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
