import { useState, useEffect } from 'react';
import './MatchScreen.css';
import WinnerModal from '../components/WinnerModal';
import { useLocation } from 'react-router-dom';

function MatchScreen() {
  const location = useLocation();
  const [players, setPlayers] = useState(['', '', '', '']);
  const [editingIndex, setEditingIndex] = useState(null);
  const [scores, setScores] = useState([
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state?.playerNames) {
      const incoming = location.state.playerNames;
      setPlayers(incoming.concat(Array(4 - incoming.length).fill('')));
    }
  }, [location.state]);

  const [matchDateTime] = useState(new Date().toLocaleString());

  const handleNameChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleScoreChange = (gameIdx, playerIdx, value) => {
    const updated = scores.map(row => [...row]);
    updated[gameIdx][playerIdx] = value;
    setScores(updated);
  };

  const playerTotals = players.map((_, i) =>
    scores.reduce((sum, game) => sum + (parseInt(game[i]) || 0), 0)
  );

  const maxScore = Math.max(...playerTotals);
  const winners = players
    .map((name, idx) => ({ name, score: playerTotals[idx] }))
    .filter(p => p.score === maxScore && p.name !== '');

  const allFieldsFilled = scores.flat().every(score => score !== '');

  const getCellClass = (gameIdx, playerIdx) => {
    const isHome =
      (gameIdx === 0 && (playerIdx === 0 || playerIdx === 1)) ||
      (gameIdx === 1 && (playerIdx === 3 || playerIdx === 1)) ||
      (gameIdx === 2 && (playerIdx === 0 || playerIdx === 3));
    return gameIdx < 3 ? (isHome ? 'bg-home' : 'bg-away') : '';
  };

  const handleSubmit = () => {
    if (!allFieldsFilled) {
      alert('Please fill in all scores before submitting the match.');
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="container my-5">
      <h2>4 Player Scorecard</h2>
    
      {/*Match Timestamp*/}
      <div className="mb-3">
        <h5><strong>Date:</strong> {matchDateTime}</h5>
      </div>
      {/* Matchup Info */}
      <h4>Team Matchup Schedule</h4>
      <ul className="list-group mb-4">
        <li className="list-group-item">Game 1: {players[0] || 'P1'} & {players[1] || 'P2'} vs {players[2] || 'P3'} & {players[3] || 'P4'}</li>
        <li className="list-group-item">Game 2: {players[3] || 'P4'} & {players[1] || 'P2'} vs {players[2] || 'P3'} & {players[0] || 'P1'}</li>
        <li className="list-group-item">Game 3: {players[0] || 'P1'} & {players[3] || 'P4'} vs {players[2] || 'P3'} & {players[1] || 'P2'}</li>
        <li className="list-group-item">Game 4: Replay Best</li>
      </ul>

      {/* Score Table */}
      <table className="table table-bordered text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>Player</th>
            <th>Game 1</th>
            <th>Game 2</th>
            <th>Game 3</th>
            <th>Game 4</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map((name, i) => (
            <tr key={i}>
              <td>
                {editingIndex === i ? (
                  <input
                    type="text"
                    value={name}
                    onChange={e => handleNameChange(i, e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    autoFocus
                    className="form-control"
                  />
                ) : (
                  <strong onClick={() => setEditingIndex(i)} style={{ cursor: 'pointer' }}>
                    {name || `Player ${i + 1}`}
                  </strong>
                )}
              </td>
              {scores.map((_, g) => (
                <td key={g}>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className={`form-control ${getCellClass(g, i)}`}
                    value={scores[g][i]}
                    onChange={e => handleScoreChange(g, i, e.target.value)}
                  />
                </td>
              ))}
              <td><strong>{playerTotals[i]}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Submit Button */}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Match
        </button>
      </div>

      {/* Instructions */}
      <div className="alert alert-info mt-4">
        <h5>Instructions:</h5>
        <ul className="mb-0">
          <li>Points are only scored when serving</li>
          <li>Game 4 is a replay of the most competitive match</li>
          <li>All games must be won by 2 points</li>
          <li>Record each player's score every game</li>
        </ul>
      </div>

      {/* Winner Modal */}
      <WinnerModal
        show={showModal}
        winners={winners}
        handleClose={() => setShowModal(false)}
        handleNewMatch={() => {
          setScores([
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', '']
          ]);
          setPlayers(['', '', '', '']);
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default MatchScreen;
