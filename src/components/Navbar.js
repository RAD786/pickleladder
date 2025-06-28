import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      {/* Site logo/name on the left, clicking it takes you home */}
      <Link className="navbar-brand" to="/">PickleLadder</Link>

      {/* Right-aligned nav items (Sign Up and Login) */}
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
