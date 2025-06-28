import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Used for making HTTP requests

function SignUp() {
  // Track user input in a single state object
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    rating: '',
    playPreference: '',
  });

  // State to display feedback messages (like errors or success)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update formData when any input field changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent full page reload

    // Clear old messages
    setError('');
    setSuccess('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send form data to the backend (excluding confirmPassword)
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        rating: formData.rating,
        playPreference: formData.playPreference,
      });

      // Show success message
      setSuccess(res.data.message);

      // Optionally clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        location: '',
        rating: '',
        playPreference: '',
      });
    } catch (err) {
      // Display error from server or fallback
      setError(err.response?.data?.message || 'Registration failed.');
    }
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Create Your Profile</h2>

      {/* Already have account link */}
      <p className="small">
        Already have an account? <Link to="/login">CLICK HERE TO LOGIN</Link>
      </p>

      {/* Show error or success messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label" htmlFor="name">Name *</label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email *</label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label" htmlFor="password">Password *</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            id="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label" htmlFor="location">Your Location *</label>
          <input
            type="text"
            className="form-control"
            name="location"
            id="location"
            required
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* Pickleball Rating */}
        <div className="mb-3">
          <label className="form-label" htmlFor="rating">
            USA Pickleball Rating *
            <a
              href="https://usapickleball.org/player-skill-rating-definitions/"
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2"
            >
              (What's this?)
            </a>
          </label>
          <select
            className="form-select"
            name="rating"
            id="rating"
            required
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="">Choose...</option>
            <option value="2.0">2.0</option>
            <option value="2.5">2.5</option>
            <option value="3.0">3.0</option>
            <option value="3.5">3.5</option>
            <option value="4.0">4.0</option>
            <option value="4.5">4.5</option>
            <option value="5.0">5.0</option>
            <option value="5.5+">5.5+</option>
          </select>
        </div>

        {/* Play Preference */}
        <div className="mb-3">
          <label className="form-label" htmlFor="playPreference">Play Preference</label>
          <select
            className="form-select"
            name="playPreference"
            id="playPreference"
            value={formData.playPreference}
            onChange={handleChange}
          >
            <option value="">Choose...</option>
            <option value="singles">Singles</option>
            <option value="doubles">Doubles</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-success mt-3">
          CREATE ACCOUNT
        </button>
      </form>
    </div>
  );
}

export default SignUp;
