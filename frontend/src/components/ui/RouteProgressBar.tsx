import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const RouteProgressBar = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none h-[2.5px] overflow-hidden">
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ scaleX: 0, transformOrigin: '0% 50%', opacity: 0.8 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              scaleX: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25, ease: 'easeOut' }
            }}
            className="w-full h-full bg-gradient-to-r from-[#FAF7F2] via-[#DCA51B] to-[#F3C343] shadow-[0_0_12px_rgba(220,165,27,0.8)]"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
