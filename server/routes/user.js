const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir); // ADDED LOG
} else {
  console.log('Uploads directory already exists:', uploadsDir); // ADDED LOG
}


// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, email, image, location, rating, playPreference } = req.body;

  console.log('User Route: Received profile update request for user ID:', req.user.id); // ADDED LOG
  console.log('User Route: Image data received (first 50 chars):', image ? image.substring(0, 50) + '...' : 'No image data'); // ADDED LOG

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      console.log('User Route: User not found for ID:', req.user.id); // ADDED LOG
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update other fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.location = location || user.location;
    user.rating = rating || user.rating;
    user.playPreference = playPreference || user.playPreference;

    console.log('User Route: User object before image processing:', user.image); // ADDED LOG

    if (image && image.startsWith('data:image')) {
      // Save Base64 image
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const filename = `profile-${req.user.id}-${Date.now()}.png`; // Assuming PNG for simplicity
      const imagePath = path.join(uploadsDir, filename);

      console.log('User Route: Attempting to write image to:', imagePath); // ADDED LOG
      fs.writeFileSync(imagePath, imageBuffer);
      console.log('User Route: Image written successfully.'); // ADDED LOG

      // Store relative path or full URL
      user.image = `/uploads/${filename}`;
      console.log('User Route: User.image updated to:', user.image); // ADDED LOG

    } else if (image === '') {
      // If image is explicitly set to empty, remove it
      user.image = null;
      console.log('User Route: User.image set to null (explicitly empty).'); // ADDED LOG
    } else if (image) {
      // If image is a URL (not base64 and not empty), keep it as is
      user.image = image;
      console.log('User Route: User.image kept as existing URL:', user.image); // ADDED LOG
    }

    console.log('User Route: User object before saving to DB:', user.image); // ADDED LOG
    await user.save();
    console.log('User Route: User object saved to DB. New image path in DB:', user.image); // ADDED LOG

    res.json(user);
  } catch (err) {
    console.error('User Route Error:', err.message); // MODIFIED LOG
    // Log the full error object for more details
    console.error('User Route Full Error Object:', err); // ADDED LOG
    res.status(500).send('Server Error');
  }
});

module.exports = router;
