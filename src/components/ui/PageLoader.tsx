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
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        const jump = prev > 80 ? 4 : (prev > 45 ? 3 : 2);
        return Math.min(prev + jump, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF7F2] text-[#18181B] select-none"
        >
          {/* Soft Diffused Ambient Warmth */}
          <div className="absolute w-[500px] h-[500px] bg-[#C9A050]/[0.06] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center px-4">
            
            {/* Animated Soft Champagne Gold Logo */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-6"
            >
              <AnimatedLogo size={110} className="w-24 h-24 sm:w-28 sm:h-28" />
            </motion.div>

            {/* Brand Title & Delicate Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#18181B] tracking-tight mb-1.5">
                Kush Dental Clinic
              </h2>
              <p className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.26em] uppercase text-[#8C867E]">
                Care • Comfort • Confidence
              </p>
            </motion.div>

            {/* Soft-Toned Progress Bar */}
            <div className="w-48 sm:w-64 flex flex-col items-center gap-2.5">
              {/* Soft Cream Track & Champagne Gold Fill */}
              <div className="w-full h-[1.5px] bg-[#E8E2D5] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#C9A050] via-[#DFBE7A] to-[#C9A050] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Status Typography */}
              <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#8C867E] font-medium font-sans">
                <span className="text-[#A47F35]">INITIALIZING</span>
                <span className="font-sans text-[#18181B] font-semibold">{progress}%</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
