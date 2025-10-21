const express = require('express');
const router = express.Router();

// Dummy in-memory user store (replace with MongoDB model later)
const users = [];

/* GET users listing. */
router.get('/', (req, res) => {
  res.json(users); // Return all users
});

/* POST user registration */
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Save user
  const newUser = { name, email, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

module.exports = router;
