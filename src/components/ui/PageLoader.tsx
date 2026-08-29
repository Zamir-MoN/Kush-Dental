import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLogo } from './AnimatedLogo';

interface PageLoaderProps {
  onComplete?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Elegant, smooth progress counter lasting ~2.8 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 600);
          return 100;
        }
        // Consistent paced increments
        const jump = prev > 85 ? 4 : (prev > 50 ? 3 : 2);
        return Math.min(prev + jump, 100);
      });
    }, 55);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -20,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F9F5EF] text-tertiary select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[450px] h-[450px] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Vector Logo (Increased Size, Clean No-Circle Design) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-8 drop-shadow-[0_12px_30px_rgba(220,165,27,0.3)]"
            >
              <AnimatedLogo size={180} className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48" />
            </motion.div>

            {/* Brand Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display font-bold text-2xl sm:text-3xl text-tertiary tracking-tight mb-8"
            >
              Kush Dental Clinic
            </motion.h2>

            {/* Ultra-Luxury Progress Indicator */}
            <div className="w-56 sm:w-72 flex flex-col items-center gap-3">
              {/* Shimmering Gold Line */}
              <div className="w-full h-[2px] bg-secondary/15 rounded-full overflow-hidden relative backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#DCA51B] via-[#FFE082] to-[#DCA51B] rounded-full shadow-[0_0_12px_rgba(220,165,27,0.7)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Refined Luxury Typography Status */}
              <div className="w-full flex justify-between items-center text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral/80 font-medium">
                <span className="text-secondary/90 font-semibold">INITIALIZING</span>
                <span className="font-mono text-tertiary font-bold tracking-widest">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
