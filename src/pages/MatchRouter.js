import { useLocation, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import MatchScreen4 from './MatchScreen4';
import MatchScreen5 from './MatchScreen5';

function MatchRouter() {
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const persisted = (() => {
    try { return JSON.parse(sessionStorage.getItem('matchSetup') || 'null'); }
    catch { return null; }
  })();

  const resolvedNumPlayers = useMemo(() => {
    const fromState = location.state?.numPlayers ?? persisted?.numPlayers;
    const fromParam = params?.numPlayers;
    const fromQuery = searchParams.get('players');
    const n = fromState != null ? Number(fromState)
      : fromParam != null ? Number(fromParam)
      : fromQuery != null ? Number(fromQuery)
      : NaN;
    return n === 4 || n === 5 ? n : NaN;
  }, [location.state, params, searchParams, persisted]);

  if (Number.isNaN(resolvedNumPlayers)) return <Navigate to="/" replace />;
  return resolvedNumPlayers === 5 ? <MatchScreen5 /> : <MatchScreen4 />;
}

export default MatchRouter;
