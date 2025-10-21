const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

exports.upload = multer({ storage });

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, sizes = '[]', colors = '[]', stock = 0, category = '', isCustomizable = true } = req.body;
    const images = (req.files || []).map(f => `/uploads/${f.filename}`);
    const product = await Product.create({ name, description, price, sizes: JSON.parse(sizes || '[]'), colors: JSON.parse(colors || '[]'), images, stock, category, isCustomizable });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
