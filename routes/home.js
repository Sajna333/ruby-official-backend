const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET / — display all electronics kits on homepage
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(6); // show 6 latest
    res.render('home', { products });
  } catch (err) {
    console.error('Failed to load homepage:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
