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
            aria-label="Scroll to top of page"
            className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#121316] text-[#DCA51B] border border-[#DCA51B]/40 shadow-xl shadow-black/50 hover:border-[#DCA51B] hover:bg-[#1a1c22] hover:shadow-[#DCA51B]/20 transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 rounded-full bg-[#DCA51B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Typography & Arrow */}
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] font-sans text-[#DCA51B] group-hover:text-amber-300 transition-colors">
              BACK TO TOP
            </span>

            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#DCA51B] group-hover:text-amber-300 transition-colors stroke-[2.5]" />
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
