import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { logout, updateProfile } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState(user?.image || '');
  const [preview, setPreview] = useState(user?.image || '');
  const [location, setLocation] = useState(user?.location || '');
  const [rating, setRating] = useState(user?.rating || '');
  const [playPreference, setPlayPreference] = useState(user?.playPreference || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // This will be the Base64 string
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          name,
          email,
          image, // This will be the Base64 string or existing URL
          location,
          rating,
          playPreference,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(updateProfile(data)); // Dispatch with the updated user data from backend
        alert('Profile updated successfully!');
      } else {
        alert(data.msg || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      alert('An error occurred during profile update. Please try again.');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mt-4 px-3 px-md-0">
      <h2>My Profile</h2>
      <div className="text-center my-3">
        <img
          src={preview || '/placeholder-profile.png'} // <-- Check this src
          alt="Profile"
          className="rounded-circle"
          width="120"
          height="120"
        />
        <div className="mt-2">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      </div>

      <div className="d-flex justify-content-between gap-3 p-4">
        <button className="btn btn-info text-white" onClick={handleGoToDashboard}>Go to Dashboard</button>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="mb-3">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="location">Your Location</label>
        <input
          type="text"
          className="form-control"
          name="location"
          id="location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="rating">
          USA Pickleball Rating
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
          value={rating}
          onChange={e => setRating(e.target.value)}
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

      <div className="mb-3">
        <label className="form-label" htmlFor="playPreference">Play Preference</label>
        <select
          className="form-select"
          name="playPreference"
          id="playPreference"
          value={playPreference}
          onChange={e => setPlayPreference(e.target.value)}
        >
          <option value="">Choose...</option>
          <option value="singles">Singles</option>
          <option value="doubles">Doubles</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className="d-flex justify-content-center">
        <button className="btn btn-success" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default Profile;
