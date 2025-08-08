// File: server/middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  console.log('Auth Middleware: Received token:', token ? 'Yes' : 'No'); // LOG 1

  // Check if not token
  if (!token) {
    console.log('Auth Middleware: No token found, sending 401'); // LOG 2
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    console.log('Auth Middleware: Attempting to verify token with secret:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED'); // LOG 3
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Token decoded successfully. Decoded user:', decoded.user); // LOG 4
    req.user = decoded.user; // This is where req.user is set
    next();
  } catch (err) {
    console.log('Auth Middleware: Token verification failed:', err.message); // LOG 5
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
