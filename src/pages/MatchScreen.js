import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import "./MatchScreen.css";

import WinnerModal from "../components/WinnerModal";
import MatchupSchedule from "../components/MatchupSchedule";
import ScoreTable from "../components/ScoreTable";

function MatchScreen() {
  const location = useLocation();
  const [players, setPlayers] = useState(["", "", "", "", ""]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [scores, setScores] = useState(
    Array(5)
      .fill()
      .map(() => Array(5).fill("")) // 5 games × 5 players
  );
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialized useNavigate
  const [matchDateTime] = useState(new Date().toLocaleString());
  const playTo = parseInt(location.state?.playTo || 11);

  // Placeholder for potential 4-player auto-match logic (keep for now)

  useEffect(() => {
    if (location.state?.playerNames) {
      const incoming = location.state.playerNames;
      setPlayers(incoming.concat(Array(5 - incoming.length).fill("")));
    }
  }, [location.state]);

  const handleNameChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleScoreChange = (gameIdx, playerIdx, value) => {
    const num = parseInt(value);
    const updated = scores.map((row) => [...row]);

    if (value === "") {
      updated[gameIdx][playerIdx] = "";
      setScores(updated);
      setError("");
      return;
    }

    if (num > playTo) {
      setError(
        `Max number of points allowed for this match is ${playTo}.\n\nFor any scores that exceed the play-to max points in a must win-by-2 situation, the scores must be entered as ${playTo}-${
          playTo - 1
        }.\n\nExample: If final score was 20–18, enter as ${playTo}-${
          playTo - 1
        }.`
      );
      return;
    }

    setError("");
    updated[gameIdx][playerIdx] = num;
    setScores(updated);
  };

  const getCellClass = (gameIdx, playerIdx) => {
    const sitOutPlayers = [4, 3, 0, 1, 2]; // Game 0–4
    const homeTeams = [
      [0, 1], // Game 1: A & B
      [1, 4], // Game 2: B & E
      [3, 4], // Game 3: D & E
      [0, 3], // Game 4: A & D
      [1, 3], // Game 5: B & D
    ];
    const awayTeams = [
      [2, 3], // Game 1: C & D
      [0, 2], // Game 2: A & C
      [1, 2], // Game 3: B & C
      [2, 4], // Game 4: C & E
      [0, 4], // Game 5: A & E
    ];

    if (playerIdx === sitOutPlayers[gameIdx]) {
      return "bg-out";
    }

    const isHome = homeTeams[gameIdx]?.includes(playerIdx);
    const isAway = awayTeams[gameIdx]?.includes(playerIdx);

    if (isHome) return "bg-home";
    if (isAway) return "bg-away";

    return "";
  };

  const isCellActive = (gameIdx, playerIdx) => {
    const sitOutPlayers = [4, 3, 0, 1, 2];
    return playerIdx !== sitOutPlayers[gameIdx];
  };

  const allFieldsFilled = scores.every((gameScores, gameIdx) =>
    gameScores.every((score, playerIdx) => {
      if (!isCellActive(gameIdx, playerIdx)) return true;
      return score !== "";
    })
  );

  const playerTotals = players.map((_, i) =>
    scores.reduce(
      (sum, game, gIdx) =>
        isCellActive(gIdx, i) ? sum + (parseInt(game[i]) || 0) : sum,
      0
    )
  );

  const maxScore = Math.max(...playerTotals);
  const winners = players
    .map((name, idx) => ({ name, score: playerTotals[idx] }))
    .filter((p) => p.score === maxScore && p.name !== "");

  const handleSubmit = () => {
    if (!allFieldsFilled) {
      alert("Please fill in all scores before submitting the match.");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="container my-5">
      <h2>5-Player Scorecard</h2>

      <div className="mb-2">
        <strong>Date:</strong> {matchDateTime}
      </div>
      <div className="mb-4">
        <strong>Play To:</strong> {playTo}
      </div>

      <MatchupSchedule players={players} />

      {error && <div className="alert alert-danger">{error}</div>}

      <ScoreTable
        players={players}
        scores={scores}
        playerTotals={playerTotals}
        handleScoreChange={handleScoreChange}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        handleNameChange={handleNameChange}
        getCellClass={getCellClass}
        isCellActive={isCellActive}
      />

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Match
        </button>
        {/* Added Dashboard Button */}
        <button className="btn btn-secondary ms-2" onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
      </div>

      <div className="alert alert-info mt-4">
        <h5>Instructions:</h5>
        <ul className="mb-0">
          <li>Points are only scored when serving</li>
          <li>5 games</li>
          <li>All games must be won by 2 points</li>
          <li>Record each player’s score every game</li>
        </ul>
      </div>

      <WinnerModal
        show={showModal}
        winners={winners}
        handleClose={() => setShowModal(false)}
        handleNewMatch={() => {
          setScores(
            Array(5)
              .fill()
              .map(() => Array(5).fill(""))
          );
          setPlayers(["", "", "", "", ""]);
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default MatchScreen;
