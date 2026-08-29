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
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DCA51B" />
          <stop offset="50%" stopColor="#F3C343" />
          <stop offset="100%" stopColor="#C49216" />
        </linearGradient>
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Outer Tooth Contour (Left Root & Outer Arch) */}
      <motion.path
        d="M 75 162 C 60 145 42 115 37 80 C 33 55 45 32 68 25 C 88 20 102 38 120 38 C 138 38 152 28 160 40 C 168 52 165 95 155 125 C 145 152 138 165 137 165"
        stroke="url(#gold-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Left side notch line */}
      <motion.path
        d="M 41 106 L 47 164"
        stroke="url(#gold-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.6, ease: "easeOut" }}
      />

      {/* Center Crown Hair / Wave Accents */}
      <motion.path
        d="M 60 38 C 72 48 95 56 115 48"
        stroke="url(#gold-gradient)"
        strokeWidth="5.5"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
      />
      <motion.path
        d="M 60 46 C 75 56 95 59 108 53"
        stroke="url(#gold-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.1, ease: "easeOut" }}
      />

      {/* Left Eye */}
      <motion.rect
        x="71"
        y="80"
        width="8.5"
        height="8.5"
        rx="2"
        fill="url(#gold-gradient)"
        initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={animate ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3, type: "spring" }}
      />

      {/* Right Eye */}
      <motion.rect
        x="126"
        y="80"
        width="8.5"
        height="8.5"
        rx="2"
        fill="url(#gold-gradient)"
        initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={animate ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4, type: "spring" }}
      />

      {/* Warm Smile Curve */}
      <motion.path
        d="M 76 98 C 74 128 128 128 130 98"
        stroke="url(#gold-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay: 1.5, ease: "backOut" }}
      />

      {/* Bottom Center Root Arch */}
      <motion.path
        d="M 94 163 C 98 147 104 147 114 163"
        stroke="url(#gold-gradient)"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
        animate={animate ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
      />
    </svg>
  );
};
