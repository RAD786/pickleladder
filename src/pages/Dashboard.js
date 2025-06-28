import { useState } from 'react';
import MatchModal from '../components/MatchModal';

function Dashboard({ user }) {
  // Track whether the match modal is open
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container my-5">
      {/* Personalized greeting */}
      <h2>Welcome, {user?.name || 'Player'}!</h2>
      <p className="text-muted">Ready to set up your next ladder match?</p>

      {/* Ladder Match button */}
      <button
        className="btn btn-primary rounded-pill px-4 py-2 mt-4"
        onClick={() => setShowModal(true)}
      >
        Ladder Match
      </button>

      {/* Modal for match setup */}
      {showModal && (
        <MatchModal closeModal={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default Dashboard;
