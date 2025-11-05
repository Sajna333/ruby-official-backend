const Order = require('../models/Order');

// ------------------- CREATE ORDER -------------------
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

    // Validation
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }
    for (let item of orderItems) {
      if (!item.product || !item.qty) {
        return res.status(400).json({ error: 'Each order item must have product and qty' });
      }
    }
    if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Create Order Error:', err.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// ------------------- GET MY ORDERS -------------------
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price');
    res.json(orders);
  } catch (err) {
    console.error('Get My Orders Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// ------------------- GET SINGLE ORDER -------------------
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product', 'name price');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error('Get Order Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// ------------------- UPDATE ORDER -------------------
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update fields
    order.isPaid = req.body.isPaid ?? order.isPaid;
    order.paidAt = req.body.isPaid ? new Date() : order.paidAt;
    order.shippingAddress = req.body.shippingAddress ?? order.shippingAddress;
    order.paymentMethod = req.body.paymentMethod ?? order.paymentMethod;
    order.totalPrice = req.body.totalPrice ?? order.totalPrice;
    order.orderItems = req.body.orderItems ?? order.orderItems;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Update Order Error:', err.message);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// ------------------- DELETE ORDER (ADMIN ONLY) -------------------
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin only' });
    }

    await order.deleteOne(); // safer than remove()
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete Order Error:', err.message);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
