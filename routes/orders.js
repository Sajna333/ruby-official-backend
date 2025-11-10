// routes/orders.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

// 🟢 Create new order
router.post("/", protect, createOrder);

// 🟢 Get all orders (Admin only)
router.get("/", protect, admin, getOrders);

// 🟢 Get logged-in user’s orders
router.get("/myorders", protect, getMyOrders);

// 🟢 Get order by ID
router.get("/:id", protect, getOrderById);

// 🟢 Update order
router.put("/:id", protect, updateOrder);

// 🟢 Delete order (Admin only)
router.delete("/:id", protect, admin, deleteOrder);

// ✅ Correct export
module.exports = router;
