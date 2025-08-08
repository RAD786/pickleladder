function MatchupSchedule({ players }) {
  const isFivePlayer = players.length === 5;

  if (!players || players.length < 4) return null;

  const getName = (idx) => players[idx] || `P${idx + 1}`;

  return (
    <div className="mb-4">
      <h4>Team Matchup Schedule</h4>
      <ul className="list-group">
        {isFivePlayer ? (
          <>
            <li className="list-group-item d-flex justify-content-between">
              <span><strong>Game 1:</strong> {getName(0)} & {getName(1)} <span className="badge bg-home ms-1">Home</span></span>
              <span>vs</span>
              <span>{getName(2)} & {getName(3)} <span className="badge bg-away ms-1">Away</span></span>
              <span><em>Sits out:</em> {getName(4)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span><strong>Game 2:</strong> {getName(1)} & {getName(4)} <span className="badge bg-home ms-1">Home</span></span>
              <span>vs</span>
              <span>{getName(0)} & {getName(2)} <span className="badge bg-away ms-1">Away</span></span>
              <span><em>Sits out:</em> {getName(3)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span><strong>Game 3:</strong> {getName(3)} & {getName(4)} <span className="badge bg-home ms-1">Home</span></span>
              <span>vs</span>
              <span>{getName(1)} & {getName(2)} <span className="badge bg-away ms-1">Away</span></span>
              <span><em>Sits out:</em> {getName(0)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span><strong>Game 4:</strong> {getName(0)} & {getName(3)} <span className="badge bg-home ms-1">Home</span></span>
              <span>vs</span>
              <span>{getName(2)} & {getName(4)} <span className="badge bg-away ms-1">Away</span></span>
              <span><em>Sits out:</em> {getName(1)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span><strong>Game 5:</strong> {getName(1)} & {getName(3)} <span className="badge bg-home ms-1">Home</span></span>
              <span>vs</span>
              <span>{getName(0)} & {getName(4)} <span className="badge bg-away ms-1">Away</span></span>
              <span><em>Sits out:</em> {getName(2)}</span>
            </li>
          </>
        ) : (
          <>
            <li className="list-group-item">Game 1: {getName(0)} & {getName(1)} vs {getName(2)} & {getName(3)}</li>
            <li className="list-group-item">Game 2: {getName(3)} & {getName(1)} vs {getName(2)} & {getName(0)}</li>
            <li className="list-group-item">Game 3: {getName(0)} & {getName(3)} vs {getName(2)} & {getName(1)}</li>
            <li className="list-group-item">Game 4: Replay Best</li>
          </>
        )}
      </ul>
    </div>
  );
}

export default MatchupSchedule;