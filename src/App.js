import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import MatchScreen from './pages/MatchScreen';
import NotFound from './pages/NotFound';
import MatchScreen4 from './pages/MatchScreen4';
import MatchScreen5 from './pages/MatchScreen5';

// inside <Routes>
<Route path="/match" element={<MatchRouter />} />


import AppNavbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Top Navigation */}
      <AppNavbar />

      {/* Main content */}
      <main className="flex-fill container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard user={{ name: 'Ryan' }} />} />
          <Route path="/match" element={<MatchScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer always at the bottom */}
      <Footer />
    </div>
  );
}

export default App;