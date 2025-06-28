import { useNavigate } from 'react-router-dom'; // Used to programmatically change routes
import './Hero.css'; // Custom CSS file for background image

function Hero() {
  const navigate = useNavigate(); // Gives us access to navigation functions

  // Navigates user to the sign-up page when button is clicked
  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="hero d-flex align-items-center justify-content-center text-white text-center p-5">
      <div>
        <h1 className="display-4">FREE Pickleball Ladder Scoresheet</h1>
        <p className="lead">Easy to use right from your phone</p>
        <button className="btn btn-primary btn-lg mt-3" onClick={handleGetStarted}>
          GET STARTED
        </button>
      </div>
    </div>
  );
}

export default Hero;
