const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// ✅ CRUD routes
router.get('/', productController.getProducts);           // Get all products
router.get('/:id', productController.getProduct);        // Get single product
router.post(
  '/',
  protect,
  admin,
  productController.upload.array('images', 6),
  productController.createProduct
); // Create
router.put(
  '/:id',
  protect,
  admin,
  productController.upload.array('images', 6),
  productController.updateProduct
); // Update
router.delete('/:id', protect, admin, productController.deleteProduct); // Delete

module.exports = router;
