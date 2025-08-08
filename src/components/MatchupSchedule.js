function MatchupSchedule({ players }) {
  if (!players || players.length < 4) return null;

  const getName = (idx) => players[idx] || `P${idx + 1}`;
  const isFivePlayer = players.length === 5;

  // Canonical schedules (must match MatchScreen4/5)
  const schedule4 = {
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

  const schedule5 = {
    sitOut: [4, 3, 0, 1, 2], // E, D, A, B, C
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

  const Row = ({ g, home, away, sitsOut }) => (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span>
        <strong>Game {g + 1}:</strong>{" "}
        {getName(home[0])} & {getName(home[1])}{" "}
        <span className="badge bg-home ms-1">Home</span>
      </span>
      <span>vs</span>
      <span>
        {getName(away[0])} & {getName(away[1])}{" "}
        <span className="badge bg-away ms-1">Away</span>
      </span>
      {typeof sitsOut === "number" && (
        <span>
          <em>Sits out:</em> {getName(sitsOut)}
        </span>
      )}
    </li>
  );

  return (
    <div className="mb-4">
      <h4>Team Matchup Schedule</h4>
      <ul className="list-group">
        {isFivePlayer ? (
          <>
            {schedule5.home.map((pair, g) => (
              <Row
                key={g}
                g={g}
                home={pair}
                away={schedule5.away[g]}
                sitsOut={schedule5.sitOut[g]}
              />
            ))}
          </>
        ) : (
          <>
            {schedule4.home.map((pair, g) => (
              <Row key={g} g={g} home={pair} away={schedule4.away[g]} />
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

export default MatchupSchedule;
