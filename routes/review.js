const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// Get all reviews for a product
router.get('/:productId', reviewController.getReviews);

// Add a review for a product
router.post('/:productId', protect, reviewController.addReview);

// Update a review (user can update their own review)
router.put('/:reviewId', protect, reviewController.updateReview);

// Delete a review (user can delete their own review)
router.delete('/:reviewId', protect, reviewController.deleteReview);

module.exports = router;
