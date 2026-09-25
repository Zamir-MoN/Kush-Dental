import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLenis } from './SmoothScroll';

export const FloatingScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollTo } = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // Show button once user scrolls down 250px
      if (scrollTop > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    scrollTo(0, {
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[90] flex items-center justify-center"
        >
          <button
            onClick={handleScrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#121316]/90 backdrop-blur-md border border-[#DCA51B]/50 shadow-2xl shadow-black/60 hover:border-[#DCA51B] hover:bg-[#1a1c22] hover:shadow-[0_0_20px_rgba(220,165,27,0.3)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            {/* Subtle Golden Pulse Ring */}
            <span className="absolute inset-0 rounded-full border border-[#DCA51B]/40 animate-ping opacity-20 pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#DCA51B]/20 to-amber-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Animated Arrow Icon */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative flex items-center justify-center text-[#DCA51B] group-hover:text-amber-300 transition-colors"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.2] group-hover:-translate-y-0.5 transition-transform duration-300" />
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
