const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

// Debug: Confirm MONGO_URI is loaded
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Stop server if DB fails to connect
  }
};

connectDB();

// ✅ Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/user', require('./routes/User'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/home', require('./routes/home'));
app.use('/api/Cart', require('./routes/Cart'));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Ruby Official API 🚀');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
