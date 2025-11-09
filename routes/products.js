// routes/products.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Product = require("../models/products");

/**
 * ✅ GET all products
 * Public
 * GET /api/products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Fetch Products Error:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/**
 * ✅ GET product by ID
 * Public
 * GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Product Fetch Error:", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

/**
 * ✅ CREATE a new product (ADMIN)
 * POST /api/products
 */
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, price, category, description, images } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category required" });
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      images,
    });

    await product.save();
    res.status(201).json({ message: "✅ Product created successfully", product });
  } catch (error) {
    console.error("❌ Product Create Error:", error.message);
    res.status(500).json({ message: "Failed to create product" });
  }
});

/**
 * ✅ UPDATE product (ADMIN)
 * PUT /api/products/:id
 */
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "✅ Product updated", product: updated });
  } catch (error) {
    console.error("❌ Product Update Error:", error.message);
    res.status(500).json({ message: "Failed to update product" });
  }
});

/**
 * ✅ DELETE product (ADMIN)
 * DELETE /api/products/:id
 */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.status(200).json({ message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("❌ Product Delete Error:", error.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
