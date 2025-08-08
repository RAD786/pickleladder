const express = require('express');
console.log('Starting server...');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use(express.static(path.join(__dirname, '../public')));

// Import and use auth routes
const authRoutes = require('./routes/auth');
console.log('Auth routes are wired up');
console.log('authRoutes:', authRoutes);
console.log('typeof authRoutes:', typeof authRoutes);
app.use('/api/auth', authRoutes);

// Import and use user routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
