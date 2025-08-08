function ScoreTable({
  players,
  scores,
  playerTotals,
  handleScoreChange,
  editingIndex,
  setEditingIndex,
  handleNameChange,
  getCellClass
}) {
  return (
    <table className="table table-bordered text-center align-middle">
      <thead className="table-dark">
        <tr>
          <th>Player</th>
          {scores.map((_, g) => (
            <th key={g}>Game {g + 1}</th>
          ))}
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
            {scores.map((_, g) => {
              const cellClass = getCellClass(g, i);
              return (
                <td key={g}>
                  {cellClass === 'bg-out' ? (
                    <input
                      type="text"
                      className="form-control bg-out text-white fw-bold text-center"
                      value="OUT"
                      disabled
                    />
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className={`form-control ${cellClass}`}
                      value={scores[g][i]}
                      onChange={e => handleScoreChange(g, i, e.target.value)}
                    />
                  )}
                </td>
              );
            })}
            <td>
              <strong>{playerTotals[i]}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ScoreTable;
