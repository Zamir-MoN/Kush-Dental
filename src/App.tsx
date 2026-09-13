import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { Services } from './pages/Services';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageLoader } from './components/ui/PageLoader';
import { FloatingScrollToTop } from './components/ui/FloatingScrollToTop';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { RouteProgressBar } from './components/ui/RouteProgressBar';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(3px)',
    transition: {
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence 
      mode="wait" 
      onExitComplete={() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }}
    >
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full flex-grow flex flex-col"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<Booking />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Global Page Loader with Animated SVG Tooth Logo */}
      {loading && <PageLoader onComplete={() => setLoading(false)} />}

      {/* Global Warm Ambience Filter (Hardware-composited, zero GPU raster penalty) */}
      <div className="fixed inset-0 pointer-events-none z-[9999] bg-[#DCA51B]/[0.02]" />
      
      <Router>
        <SmoothScroll>
          {/* Top Gold Route Progress Bar */}
          <RouteProgressBar />

          {/* Persistent Stable Header */}
          <Header />

          {/* Floating Back to Top Button */}
          <FloatingScrollToTop />

          {/* Animated Main Page Views */}
          <AnimatedRoutes />

          {/* Persistent Stable Footer */}
          <Footer />
        </SmoothScroll>
      </Router>
    </>
  );
}

export default App;
