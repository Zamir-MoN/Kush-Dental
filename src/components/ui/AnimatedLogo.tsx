import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  className = "w-10 h-10", 
  size = 64,
  animate = true 
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="champagne-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A050" />
          <stop offset="50%" stopColor="#DFBE7A" />
          <stop offset="100%" stopColor="#B88B38" />
        </linearGradient>
      </defs>

      {/* Smooth Soft Curved Tooth Outline */}
      <motion.path
        d="M 28 20 C 40 16, 45 27, 50 27 C 55 27, 60 16, 72 20 C 85 24, 86 52, 79 72 C 73 88, 62 86, 56 75 C 53 69, 47 69, 44 75 C 38 86, 27 88, 21 72 C 14 52, 15 24, 28 20 Z"
        stroke="url(#champagne-gold)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Soft Smiling Face - Left Eye */}
      <motion.circle
        cx="39"
        cy="46"
        r="2.8"
        fill="url(#champagne-gold)"
        initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={animate ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
      />

      {/* Soft Smiling Face - Right Eye */}
      <motion.circle
        cx="61"
        cy="46"
        r="2.8"
        fill="url(#champagne-gold)"
        initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={animate ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
      />

      {/* Soft Curved Smile */}
      <motion.path
        d="M 39 56 C 42 64, 58 64, 61 56"
        stroke="url(#champagne-gold)"
        strokeWidth="3.2"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.0, ease: "easeOut" }}
      />
    </svg>
  );
};
