import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MatchModal({ closeModal }) {
  const [playerCount, setPlayerCount] = useState(4); // Default to 4 players
  const [playTo, setPlayTo] = useState('11');
  const [customPlayTo, setCustomPlayTo] = useState('');
  const [playerNames, setPlayerNames] = useState(['', '', '', '', '']); // Always keep 5 slots

  const navigate = useNavigate();

  // Handle name input change
  const handlePlayerChange = (e, i) => {
    const updated = [...playerNames];
    updated[i] = e.target.value;
    setPlayerNames(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalPlayTo = playTo === 'custom' ? customPlayTo : playTo;

    const matchData = {
      playerCount,
      playTo: finalPlayTo,
      players: playerNames.slice(0, playerCount),
    };

    // Navigate to match screen with state
    navigate('/match', {
      state: {
        playerNames: playerNames.slice(0, playerCount),
        numPlayers: playerCount,
        playTo: finalPlayTo,
      }
    });

    closeModal();
  };


  return (
    <div className="modal show fade d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Set Up Your Ladder Match</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {/* Question 1: Number of Players */}
              <div className="mb-3">
                <label htmlFor="playerCount" className="form-label"># of Players:</label>
                <select
                  id="playerCount"
                  className="form-select"
                  value={playerCount}
                  onChange={e => setPlayerCount(Number(e.target.value))}
                >
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              {/* Question 2: Play To */}
              <div className="mb-3">
                <label htmlFor="playTo" className="form-label">Play To:</label>
                <select
                  id="playTo"
                  className="form-select"
                  value={playTo}
                  onChange={e => setPlayTo(e.target.value)}
                >
                  <option value="11">11</option>
                  <option value="15">15</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Custom Play To */}
              {playTo === 'custom' && (
                <div className="mb-3">
                  <label htmlFor="customPlayTo" className="form-label">Custom Score (1–99)</label>
                  <input
                    type="number"
                    id="customPlayTo"
                    className="form-control"
                    min="1"
                    max="99"
                    value={customPlayTo}
                    onChange={e => setCustomPlayTo(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Question 3: Player Names */}
              {[...Array(playerCount)].map((_, i) => (
                <div className="mb-2" key={i}>
                  <label className="form-label">Player {i + 1} Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={playerNames[i] || ''}
                    onChange={e => handlePlayerChange(e, i)}
                    required
                  />
                </div>
              ))}

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-success">Start Match</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MatchModal;
