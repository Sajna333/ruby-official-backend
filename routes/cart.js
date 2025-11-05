const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

// Get user's cart
router.get('/', protect, cartController.getCart);

// Add product to cart
router.post('/', protect, cartController.addToCart);

// Update quantity of a specific product in cart
router.put('/:productId', protect, cartController.updateCart);

// Remove a specific product from cart
router.delete('/:productId', protect, cartController.removeProduct);

// Clear entire cart
router.delete('/clear', protect, cartController.clearCart);

module.exports = router;
