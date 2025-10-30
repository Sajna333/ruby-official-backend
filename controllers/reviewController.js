const Review = require('../models/Review');

// Get all reviews for a product
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    console.error('Get Reviews Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id,
      product: req.params.productId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Add Review Error:', error.message);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();
    res.json(review);
  } catch (error) {
    console.error('Update Review Error:', error.message);
    res.status(500).json({ error: 'Failed to update review' });
  }
};


// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    // Check if current user is the review owner
    if (!req.user || review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    // Use deleteOne instead of remove for stability
    await Review.deleteOne({ _id: review._id });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
