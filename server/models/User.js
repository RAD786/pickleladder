const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: String, required: true },
  playPreference: { type: String },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
