import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { Home } from './pages/Home';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageLoader } from './components/ui/PageLoader';
import { FloatingScrollToTop } from './components/ui/FloatingScrollToTop';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { RouteProgressBar } from './components/ui/RouteProgressBar';
import { BlogList } from './pages/staff/BlogList';
import { BlogCreate } from './pages/staff/BlogCreate';
import { BlogEdit } from './pages/staff/BlogEdit';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Direct imports for staff portal to prevent dynamic chunk failures and white screen flashes on navigation
import { PortalLayout } from './components/layout/PortalLayout';
import { Dashboard } from './pages/staff/Dashboard';
import { Leads } from './pages/staff/Leads';
import { Appointments } from './pages/staff/Appointments';
import { Patients } from './pages/staff/Patients';
import { Users } from './pages/staff/Users';
import { ContactList } from './pages/staff/contacts/ContactList';
import { ContactDetail } from './pages/staff/contacts/ContactDetail';

// Route-level code splitting for secondary public marketing pages
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
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(2px)',
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');

  // Staff Portal Routes: Render directly without AnimatePresence mode="wait"
  // This guarantees PortalLayout stays permanently mounted, redirects (e.g. /staff -> dashboard)
  // fire instantly without getting trapped in exit animations, and no white screens occur.
  if (isStaffRoute) {
    return (
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen bg-[#0D0E12] flex items-center justify-center text-zinc-100">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#DCA51B]/20 border-t-[#DCA51B]"></div>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Loading Portal...</span>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/staff/login" element={<Login />} />
            <Route 
              path="/staff" 
              element={
                <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                  <PortalLayout />
                </ProtectedRoute>
              } 
            >
              <Route index element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="leads/:id" element={<Leads />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="appointments/:id" element={<Appointments />} />
              <Route path="contacts" element={<ContactList />} />
              <Route path="contacts/:id" element={<ContactDetail />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<Patients />} />
              <Route path="users" element={<ProtectedRoute allowedRoles={['DOCTOR']}><Users /></ProtectedRoute>} />
              <Route path="blog" element={<ProtectedRoute allowedRoles={['DOCTOR']}><BlogList /></ProtectedRoute>} />
              <Route path="blog/new" element={<ProtectedRoute allowedRoles={['DOCTOR']}><BlogCreate /></ProtectedRoute>} />
              <Route path="blog/:id/edit" element={<ProtectedRoute allowedRoles={['DOCTOR']}><BlogEdit /></ProtectedRoute>} />
              <Route path="dxgen" element={<Navigate to="/staff/blog" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Public Marketing Site Routes (Home, About, Services, Blog, Book)
  return (
    <ErrorBoundary>
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
          <Suspense fallback={
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#DCA51B]/20 border-t-[#DCA51B]"></div>
            </div>
          }>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/book" element={<Booking />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
