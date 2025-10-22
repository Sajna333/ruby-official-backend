const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// CREATE a new order
router.post('/', protect, orderController.createOrder);

// GET all orders of logged-in user
router.get('/myorders', protect, orderController.getMyOrders);

// GET single order by ID
router.get('/:id', protect, orderController.getOrderById);

// UPDATE an order (owner or admin)
router.put('/:id', protect, orderController.updateOrder);

// DELETE an order (ADMIN ONLY)
router.delete('/:id', protect, admin, orderController.deleteOrder);

module.exports = router;
