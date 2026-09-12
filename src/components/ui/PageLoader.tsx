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
          <div className="absolute w-[500px] h-[500px] bg-[#DCA51B]/[0.08] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center px-4">
            
            {/* Animated Official Gold Logo */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-6"
            >
              <AnimatedLogo size={120} className="w-28 h-28 sm:w-32 sm:h-32" />
            </motion.div>

            {/* Brand Title matching BrandLogo */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="flex items-baseline justify-center gap-1.5">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141518] tracking-tight">
                  Kush Dental
                </h2>
                <span className="font-serif text-xl sm:text-2xl font-medium italic text-[#DCA51B]">
                  Clinic
                </span>
              </div>
              <p className="font-sans text-[9px] sm:text-[10px] font-semibold tracking-[0.24em] text-zinc-400 uppercase mt-1">
                Precision Dentistry
              </p>
            </motion.div>

            {/* Soft-Toned Progress Bar */}
            <div className="w-48 sm:w-64 flex flex-col items-center gap-2.5">
              {/* Soft Cream Track & Honey Gold Fill */}
              <div className="w-full h-[2px] bg-[#E8E2D5] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#DCA51B] via-[#F5D77F] to-[#DCA51B] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Status Typography */}
              <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium font-sans">
                <span className="text-[#DCA51B] font-bold">INITIALIZING</span>
                <span className="font-sans text-[#141518] font-bold">{progress}%</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
