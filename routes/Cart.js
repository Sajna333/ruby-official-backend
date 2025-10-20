const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Assuming you have a Product model

let cart = [];

router.post('/add', async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (product) {
      cart.push(product);
    }
    res.redirect('/cart');
  } catch (err) {
    res.render('error', { message: 'Failed to add product to cart.' });
  }
});

router.get('/', (req, res) => {
  res.render('cart', { cart });
});

module.exports = router;
