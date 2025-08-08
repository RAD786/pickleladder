function MatchHeader({ matchDateTime, playTo }) {
  return (
    <div className="mb-4">
      <h2>4 Player Scorecard</h2>
      <h5><strong>Date:</strong> {matchDateTime}</h5>
      <h6><strong>Play To:</strong> {playTo}</h6>
    </div>
  );
}

export default MatchHeader;
