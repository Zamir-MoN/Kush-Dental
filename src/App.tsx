import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';

function App() {
  return (
    <>
      {/* Global Warm Filter */}
      <div className="fixed inset-0 pointer-events-none z-[9999] bg-[#DCA51B]/[0.04] mix-blend-multiply" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Booking />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
