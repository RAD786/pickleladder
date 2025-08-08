import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import "./MatchScreen.css";

import WinnerModal from "../components/WinnerModal";
import MatchupSchedule from "../components/MatchupSchedule";
import ScoreTable from "../components/ScoreTable";

/**
 * Canonical 4-player base schedule (players A–D => 0..3), 3 games:
 * G1: A+B (home) vs C+D (away)
 * G2: A+C (home) vs B+D (away)
 * G3: A+D (home) vs B+C (away)
 */
const BASE_SCHEDULE_4P = {
  home: [
    [0, 1], // G1: A+B
    [0, 2], // G2: A+C
    [0, 3], // G3: A+D
  ],
  away: [
    [2, 3], // G1: C+D
    [1, 3], // G2: B+D
    [1, 2], // G3: B+C
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

/** 4-player match screen */
function MatchScreen4() {
  const setup = useMatchSetup();
  const navigate = useNavigate();

  // Guard: only allow 4-player matches here
  if (!setup || (setup.numPlayers !== 4 && setup.playerNames?.length !== 4)) {
    return <Navigate to="/" replace />;
  }

  const [players, setPlayers] = useState(["", "", "", ""]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Schedule is dynamic so we can append Game 4
  const [schedule, setSchedule] = useState({
    home: [...BASE_SCHEDULE_4P.home],
    away: [...BASE_SCHEDULE_4P.away],
  });

  // Scores mirror schedule length (rows = games, cols = 4 players)
  const [scores, setScores] = useState(Array.from({ length: 3 }, () => Array(4).fill("")));

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

  const [matchDateTime] = useState(new Date().toLocaleString());
  const playTo = Number(setup.playTo ?? 11);

  useEffect(() => {
    const names = (setup.playerNames || []).slice(0, 4);
    setPlayers([...names, ...Array(Math.max(0, 4 - names.length)).fill("")].slice(0, 4));
  }, [setup]);

  // Keep scores array length in sync if schedule changes (e.g., after adding Game 4)
  useEffect(() => {
    setScores((prev) => {
      if (prev.length === schedule.home.length) return prev;
      // Extend with empty row for new game
      return [...prev, Array(4).fill("")];
    });
  }, [schedule.home.length]);

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

  /** Role for a given cell in the schedule: 'home' | 'away' | '' (no 'out' for 4p) */
  const getCellRole = (gameIdx, playerIdx) => {
    if (gameIdx < 0 || gameIdx >= schedule.home.length || playerIdx < 0 || playerIdx >= 4) return "";
    if (schedule.home[gameIdx]?.includes(playerIdx)) return "home";
    if (schedule.away[gameIdx]?.includes(playerIdx)) return "away";
    return "";
  };

  /** CSS class from role */
  const getCellClass = (gameIdx, playerIdx) => {
    const role = getCellRole(gameIdx, playerIdx);
    switch (role) {
      case "home":
        return "bg-home";
      case "away":
        return "bg-away";
      default:
        return "";
    }
  };

  const isCellActive = () => true; // no 'out' cells for 4-player

  const allFieldsFilledBase3 =
    scores.length >= 3 && scores.slice(0, 3).every((row) => row.every((v) => v !== ""));

  const allFieldsFilled = scores.every((gameScores, gameIdx) =>
    gameScores.every((score, playerIdx) => (isCellActive(gameIdx, playerIdx) ? score !== "" : true))
  );

  // --- Most Competitive Game logic (based on first 3 games only) ---
  const teamPoints = (g) => {
    const homePair = schedule.home[g];
    const awayPair = schedule.away[g];
    const home =
      (Number(scores[g][homePair[0]]) || 0) + (Number(scores[g][homePair[1]]) || 0);
    const away =
      (Number(scores[g][awayPair[0]]) || 0) + (Number(scores[g][awayPair[1]]) || 0);
    return { home, away, diff: Math.abs(home - away), total: home + away };
  };

  const recommendedGame = useMemo(() => {
    if (!allFieldsFilledBase3 || schedule.home.length > 3 || dismissedSuggestion) return null;
    const stats = [0, 1, 2].map((g) => ({ g, ...teamPoints(g) }));
    // Sort by: diff asc, total desc, game desc (prefer later)
    stats.sort((a, b) => a.diff - b.diff || b.total - a.total || b.g - a.g);
    return stats[0];
  }, [allFieldsFilledBase3, schedule.home.length, dismissedSuggestion, scores]);

  const addGame4 = () => {
    if (!recommendedGame) return;
    const g = recommendedGame.g;
    const newHome = schedule.away[g]; // swap sides for freshness
    const newAway = schedule.home[g];

    setSchedule((s) => ({
      home: [...s.home, newHome],
      away: [...s.away, newAway],
    }));
  };

  const handleSubmit = () => {
    if (!allFieldsFilled) {
      alert("Please fill in all scores before submitting the match.");
      return;
    }
    setShowModal(true);
  };

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

  return (
    <div className="container my-5">
      <h2>4-Player Scorecard</h2>

      <div className="mb-2">
        <strong>Date:</strong> {matchDateTime}
      </div>
      <div className="mb-4">
        <strong>Play To:</strong> {playTo}
      </div>

      {/* Pass schedule so MatchupSchedule can optionally show Game 4 */}
      <MatchupSchedule players={players} schedule4={schedule} />

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
      />

      {/* Suggest Game 4 once G1–G3 are complete and before adding it */}
      {recommendedGame && schedule.home.length === 3 && (
        <div className="alert alert-secondary mt-3 d-flex justify-content-between align-items-center">
          <div>
            <strong>Suggested Game 4:</strong> Replay{" "}
            <strong>Game {recommendedGame.g + 1}</strong> (diff {recommendedGame.diff}, total{" "}
            {recommendedGame.total}). Home/Away will be swapped.
          </div>
          <div>
            <button className="btn btn-outline-primary btn-sm me-2" onClick={addGame4}>
              Add Game 4
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setDismissedSuggestion(true)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

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
          <li>3 games (each player partners with each other once) + optional Game 4 rematch</li>
          <li>All games must be won by 2 points</li>
          <li>Record each player’s score every game</li>
        </ul>
      </div>

      <WinnerModal
        show={showModal}
        winners={winners}
        handleClose={() => setShowModal(false)}
        handleNewMatch={() => {
          setSchedule({ home: [...BASE_SCHEDULE_4P.home], away: [...BASE_SCHEDULE_4P.away] });
          setScores(Array.from({ length: 3 }, () => Array(4).fill("")));
          setPlayers(["", "", "", ""]);
          setDismissedSuggestion(false);
          setShowModal(false);
        }}
      />
    </div>
  );
}

export default MatchScreen4;
