import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MatchModal({ closeModal }) {
  const [playerCount, setPlayerCount] = useState(4); // Default to 4
  const [playTo, setPlayTo] = useState('11');       // string from <select>
  const [customPlayTo, setCustomPlayTo] = useState('');
  const [playerNames, setPlayerNames] = useState(['', '', '', '', '']); // up to 5

  const navigate = useNavigate();

  const handlePlayerChange = (e, i) => {
    const updated = [...playerNames];
    updated[i] = e.target.value;
    setPlayerNames(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Resolve play-to as a number
    const finalPlayTo = Number(playTo === 'custom' ? customPlayTo : playTo);
    if (!Number.isFinite(finalPlayTo) || finalPlayTo < 1 || finalPlayTo > 99) {
      alert('Please enter a valid target score between 1 and 99.');
      return;
    }

    const names = playerNames.slice(0, playerCount).map(n => n?.trim() ?? '');

    // Persist so refresh / direct nav doesn't lose state
    const matchSetup = {
      numPlayers: Number(playerCount),
      playTo: finalPlayTo,
      playerNames: names,
    };
    try {
      sessionStorage.setItem('matchSetup', JSON.stringify(matchSetup));
    } catch (e) {
      // non-fatal
      console.warn('Could not persist match setup:', e);
    }

    // Debug: see exactly what we send
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Starting match with:', matchSetup);
    }

    navigate('/match', { state: matchSetup });
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

              {/* # of Players */}
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

              {/* Play To */}
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

              {/* Player Names */}
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
