const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/**
 * ✅ REGISTER a new user
 * POST /api/user/register
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: '✅ User registered successfully' });
  } catch (error) {
    console.error('❌ Register Error:', error.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * ✅ LOGIN user and return JWT
 * POST /api/user/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: '✅ Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * ✅ GET all users (for admin/test)
 * GET /api/user
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Fetch Users Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
