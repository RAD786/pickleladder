// File: server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your User model is correctly defined here

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, rating, playPreference } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      location,
      rating,
      playPreference,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err.message); // Log the actual error on the server
    res.status(500).json({ error: 'Server Error during registration' }); // Send a more specific error message
  }
});

// Log in an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create token payload
    // IMPORTANT: Ensure this structure matches what auth middleware expects (decoded.user.id)
    const payload = {
      user: {
        id: user.id // Mongoose models have a virtual 'id' getter for '_id'
      }
    };

    // Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your JWT_SECRET from .env
      { expiresIn: '7d' }, // Token expiration (e.g., 7 days)
      (err, token) => {
        if (err) throw err;
        // Send back the token and the user object (excluding sensitive data like password)
        res.json({
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image, // Include image if it exists on the user model
            location: user.location,
            rating: user.rating,
            playPreference: user.playPreference,
            // Add any other user properties you want to send to the frontend
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message); // Log the actual error on the server
    res.status(500).json({ error: 'Server Error during login' }); // Send a more specific error message
  }
});

module.exports = router;
