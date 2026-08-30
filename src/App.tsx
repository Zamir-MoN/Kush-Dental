import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { Services } from './pages/Services';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { PageLoader } from './components/ui/PageLoader';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Global Page Loader with Animated SVG Tooth Logo */}
      {loading && <PageLoader onComplete={() => setLoading(false)} />}

      {/* Global Warm Filter */}
      <div className="fixed inset-0 pointer-events-none z-[9999] bg-[#DCA51B]/[0.04] mix-blend-multiply" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<Booking />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
