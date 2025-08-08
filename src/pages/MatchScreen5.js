import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import "./MatchScreen.css";

import WinnerModal from "../components/WinnerModal";
import MatchupSchedule from "../components/MatchupSchedule";
import ScoreTable from "../components/ScoreTable";

/**
 * Canonical 5-player schedule (players A–E => 0..4), 5 games:
 * - sitOut[gameIdx] gives the player who sits out
 * - home[gameIdx] and away[gameIdx] give the playing pairs
 *
 * Verified so that player 4 (E) is:
 *  G1: sit out
 *  G2: home
 *  G3: home
 *  G4: away
 *  G5: away
 */
const SCHEDULE_5P = {
  sitOut: [4, 3, 0, 1, 2], // game 0..4
  home: [
    [0, 1], // G1: A+B
    [1, 4], // G2: B+E
    [3, 4], // G3: D+E
    [0, 3], // G4: A+D
    [1, 3], // G5: B+D
  ],
  away: [
    [2, 3], // G1: C+D
    [0, 2], // G2: A+C
    [1, 2], // G3: B+C
    [2, 4], // G4: C+E
    [0, 4], // G5: A+E
  ],
};

/** Resolve match setup from location.state or sessionStorage */
function useMatchSetup() {
  const location = useLocation();
  return useMemo(() => {
    const fromState = location.state;
    if (fromState?.numPlayers || fromState?.playerNames) return fromState;
    try {
      const persisted = JSON.parse(sessionStorage.getItem("matchSetup") || "null");
      return persisted || null;
    } catch {
      return null;
    }
  }, [location.state]);
}

function MatchScreen5() {
  const setup = useMatchSetup();
  const navigate = useNavigate();

  // Guard: only allow 5-player matches here
  if (!setup || (setup.numPlayers !== 5 && setup.playerNames?.length !== 5)) {
    return <Navigate to="/" replace />;
  }

  const [players, setPlayers] = useState(["", "", "", "", ""]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [scores, setScores] = useState(Array.from({ length: 5 }, () => Array(5).fill(""))); // 5 games × 5 players
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [matchDateTime] = useState(new Date().toLocaleString());
  const playTo = Number(setup.playTo ?? 11);

  useEffect(() => {
    const names = (setup.playerNames || []).slice(0, 5);
    setPlayers([...names, ...Array(Math.max(0, 5 - names.length)).fill("")].slice(0, 5));
  }, [setup]);

  const handleNameChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleScoreChange = (gameIdx, playerIdx, value) => {
    const updated = scores.map((row) => [...row]);

    // Empty clears
    if (value === "") {
      updated[gameIdx][playerIdx] = "";
      setScores(updated);
      setError("");
      return;
    }

    const num = Number(value);
    if (!Number.isFinite(num)) return;

    if (num > playTo) {
      setError(
        `Max points for this match is ${playTo}.\n\n` +
          `If the real score exceeded ${playTo} due to win-by-2, enter it as ${playTo}-${playTo - 1}.\n` +
          `Example: If final was 20–18, enter ${playTo}-${playTo - 1}.`
      );
      return;
    }

    setError("");
    updated[gameIdx][playerIdx] = num;
    setScores(updated);
  };

  /** Role for a given cell in the schedule: 'out' | 'home' | 'away' | '' */
  const getCellRole = (gameIdx, playerIdx) => {
    if (gameIdx < 0 || gameIdx >= 5 || playerIdx < 0 || playerIdx >= 5) return "";
    if (SCHEDULE_5P.sitOut[gameIdx] === playerIdx) return "out";
    if (SCHEDULE_5P.home[gameIdx]?.includes(playerIdx)) return "home";
    if (SCHEDULE_5P.away[gameIdx]?.includes(playerIdx)) return "away";
    return "";
  };

  /** CSS class from role; ensures E in Game 5 gets 'bg-away' */
  const getCellClass = (gameIdx, playerIdx) => {
    const role = getCellRole(gameIdx, playerIdx);
    switch (role) {
      case "out":
        return "bg-out";
      case "home":
        return "bg-home";
      case "away":
        return "bg-away";
      default:
        return "";
    }
  };

  const isCellActive = (gameIdx, playerIdx) => getCellRole(gameIdx, playerIdx) !== "out";

  const allFieldsFilled = scores.every((gameScores, gameIdx) =>
    gameScores.every((score, playerIdx) => (!isCellActive(gameIdx, playerIdx) ? true : score !== ""))
  );

  const playerTotals = players.map((_, i) =>
    scores.reduce(
      (sum, game, gIdx) => (isCellActive(gIdx, i) ? sum + (Number(game[i]) || 0) : sum),
      0
    )
  );

  const maxScore = Math.max(...playerTotals);
  const winners = players
    .map((name, idx) => ({ name, score: playerTotals[idx] }))
    .filter((p) => p.name && p.score === maxScore);

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
        <button className="btn btn-secondary ms-2" onClick={() => navigate("/dashboard")}>
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
          setScores(Array.from({ length: 5 }, () => Array(5).fill("")));
          setPlayers(["", "", "", "", ""]);
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default MatchScreen5;
