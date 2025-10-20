const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', protect, admin, productController.upload.array('images', 6), productController.createProduct);
module.exports = router;
