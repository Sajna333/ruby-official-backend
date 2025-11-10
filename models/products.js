// models/products.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    images: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    category: { type: String, default: "" },
    isCustomizable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite on re-imports
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
