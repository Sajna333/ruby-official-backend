const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, getOrders } = require('../controllers/orderController');
router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
module.exports = router;
