import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Local state for form inputs and error message
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const navigate = useNavigate(); // Allows redirect after login

  // Handle changes to form inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault(); // Prevent page reload

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError('Please fill in both fields.');
      return;
    }

    setError(''); // Clear previous errors

    // TODO: send login request to backend
    console.log('Logging in with:', formData);

    // Simulated success response (replace with real backend call)
    const fakeSuccess = true;

    if (fakeSuccess) {
      // Later: store user token here, maybe using localStorage
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } else {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email *</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label className="form-label" htmlFor="password">Password *</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          LOGIN
        </button>
      </form>
    </div>
  );
}

export default Login;
