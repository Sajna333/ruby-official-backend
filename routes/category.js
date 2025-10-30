const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', categoryController.getCategories);

// Get single category
router.get('/:id', categoryController.getCategory);

// Create category (admin only)
router.post('/', protect, admin, categoryController.createCategory);

// Update category (admin only)
router.put('/:id', protect, admin, categoryController.updateCategory);

// Delete category (admin only)
router.delete('/:id', protect, admin, categoryController.deleteCategory);

module.exports = router;
