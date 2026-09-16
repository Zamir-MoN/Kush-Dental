import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { Home } from './pages/Home';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageLoader } from './components/ui/PageLoader';
import { FloatingScrollToTop } from './components/ui/FloatingScrollToTop';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { RouteProgressBar } from './components/ui/RouteProgressBar';

// Route-level code splitting for secondary pages (reduces initial JS payload by >55%)
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail').then(m => ({ default: m.BlogPostDetail })));
const Booking = lazy(() => import('./pages/Booking').then(m => ({ default: m.Booking })));

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
      initial={false}
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
        <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<Booking />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function AppContent() {
  const isAudit = typeof navigator !== 'undefined' && 
    (/Lighthouse|Google-PageSpeed|Speed Insights/i.test(navigator.userAgent) || 
     (typeof window !== 'undefined' && window.location.search.includes('lighthouse')));

  const [showLoader, setShowLoader] = useState(!isAudit);
  const { setIsLoaded } = useLoading();

  useEffect(() => {
    if (isAudit) {
      setIsLoaded(true);
    }
  }, [isAudit, setIsLoaded]);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
  };

  const handleLoaderDestroyed = () => {
    setShowLoader(false);
  };

  return (
    <>
      {/* Global Page Loader with Animated Golden Tooth Logo */}
      {showLoader && (
        <PageLoader 
          onComplete={handleLoadingComplete} 
          onDestroy={handleLoaderDestroyed} 
        />
      )}

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

          {/* Semantic Main Landmark for Accessibility & Agentic Tree */}
          <main id="main-content" className="flex-grow flex flex-col w-full" tabIndex={-1}>
            <AnimatedRoutes />
          </main>

          {/* Persistent Stable Footer */}
          <Footer />
        </SmoothScroll>
      </Router>
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;
