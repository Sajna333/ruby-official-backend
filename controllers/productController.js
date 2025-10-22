const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

exports.upload = multer({ storage });

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, sizes = '[]', colors = '[]', stock, category, isCustomizable } = req.body;

    const images = (req.files || []).map(f => `/uploads/${f.filename}`);

    const product = await Product.create({
      name,
      description,
      price: price ?? 0,
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [],
      colors: typeof colors === 'string' ? JSON.parse(colors) : colors || [],
      images,
      stock: stock ?? 0,
      category: category || '',
      isCustomizable: isCustomizable ?? true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// ✅ Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// ✅ Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ error: 'Invalid product ID' });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ error: 'Invalid product ID' });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { name, description, price, sizes, colors, stock, category, isCustomizable } = req.body;

    // Update images if uploaded
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(f => `/uploads/${f.filename}`);
    }

    // Safe parsing for sizes/colors
    product.sizes = sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : product.sizes;
    product.colors = colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : product.colors;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.category = category || product.category;
    product.isCustomizable = isCustomizable ?? product.isCustomizable;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ error: 'Invalid product ID' });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Use deleteOne instead of remove()
    await Product.deleteOne({ _id: id });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
