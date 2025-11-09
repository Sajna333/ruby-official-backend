// routes/orders.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const orderController = require("../controllers/orderController");

/**
 * ✅ CREATE a new order
 * POST /api/orders
 */
router.post("/", protect, orderController.createOrder);

/**
 * ✅ GET all orders of logged-in user
 * GET /api/orders/myorders
 */
router.get("/myorders", protect, orderController.getMyOrders);

/**
 * ✅ GET all orders (ADMIN)
 * GET /api/orders
 */
router.get("/", protect, admin, orderController.getOrders);

/**
 * ✅ GET single order by ID
 * GET /api/orders/:id
 */
router.get("/:id", protect, orderController.getOrderById);

/**
 * ✅ UPDATE an order (user or admin)
 * PUT /api/orders/:id
 */
router.put("/:id", protect, orderController.updateOrder);

/**
 * ✅ DELETE an order (ADMIN)
 * DELETE /api/orders/:id
 */
router.delete("/:id", protect, admin, orderController.deleteOrder);

module.exports = router;
