const Cart = require('../models/Cart');

// Get the user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    res.json(cart || { products: [] });
  } catch (error) {
    console.error('Get Cart Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [{ product: productId, quantity }] });
    } else {
      const index = cart.products.findIndex(p => p.product.toString() === productId);
      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Add to Cart Error:', error.message);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

// Update quantity of a specific product
exports.updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const index = cart.products.findIndex(p => p.product.toString() === productId);
    if (index > -1) {
      if (quantity <= 0) cart.products.splice(index, 1);
      else cart.products[index].quantity = quantity;
    } else {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Update Cart Error:', error.message);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// Remove a specific product from cart
exports.removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Remove Product Error:', error.message);
    res.status(500).json({ error: 'Failed to remove product' });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear Cart Error:', error.message);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
