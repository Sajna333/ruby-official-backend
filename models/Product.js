const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: [String],
  colors: [String],
  images: [String],
  stock: { type: Number, default: 0 },
  category: { type: String },
  isCustomizable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
