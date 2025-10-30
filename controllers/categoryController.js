const Category = require('../models/category');
const Product = require('../models/product');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Get Categories Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get single category
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    console.error('Get Category Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create Category Error:', error.message);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Update Category Error:', error.message);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    // Optional: check if products are using this category
    const productsUsingCategory = await Product.find({ category: category._id });
    if (productsUsingCategory.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category. Some products are using this category.' 
      });
    }

    await category.remove();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete Category Error:', error); // <-- log full error
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
