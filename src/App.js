import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MatchScreen from './pages/MatchScreen';
import NotFound from './pages/NotFound'; // Optional: 404 page

// Import global components (e.g. navbar)
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">

        {/* Top Navigation */}
        <Navbar />

        {/* Main content */}
        <main className="flex-fill container my-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard user={{ name: 'Ryan' }} />} />
            <Route path="/match" element={<MatchScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer always at the bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
