import { useLocation, Navigate } from 'react-router-dom';
import MatchScreen4 from './MatchScreen4';
import MatchScreen5 from './MatchScreen5';

function MatchRouter() {
  const location = useLocation();
  const numPlayers = location.state?.numPlayers;

  if (!numPlayers) {
    return <Navigate to="/" replace />;
  }

  if (numPlayers === 5) {
    return <MatchScreen5 />;
  }

  return <MatchScreen4 />;
}

export default MatchRouter;
