import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "", 
  isDark = false,
  size = 'md' 
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 46 : 38;
  
  return (
    <Link to="/" className={`flex items-center gap-3.5 group cursor-pointer select-none ${className}`}>
      {/* Smiling Gold Tooth Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Smooth Rounded Tooth Outline */}
          <path 
            d="M 28 20 C 40 16, 45 27, 50 27 C 55 27, 60 16, 72 20 C 85 24, 86 52, 79 72 C 73 88, 62 86, 56 75 C 53 69, 47 69, 44 75 C 38 86, 27 88, 21 72 C 14 52, 15 24, 28 20 Z" 
            stroke="#DCA51B" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          />
          {/* Smiling Face - Left Eye */}
          <circle cx="39" cy="46" r="2.8" fill="#DCA51B" />
          {/* Smiling Face - Right Eye */}
          <circle cx="61" cy="46" r="2.8" fill="#DCA51B" />
          {/* Smiling Face - Curved Warm Smile */}
          <path 
            d="M 39 56 C 42 64, 58 64, 61 56" 
            stroke="#DCA51B" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {/* Brand Text & Tagline */}
      <div className="flex flex-col justify-center">
        <span className={`font-sans font-extrabold tracking-tight leading-none transition-colors ${
          size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl md:text-[22px]'
        } ${isDark ? 'text-white' : 'text-[#121316]'}`}>
          Kush Dental Clinic
        </span>
        <span className={`text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.24em] uppercase mt-1 transition-colors ${
          isDark ? 'text-[#DCA51B]' : 'text-zinc-500'
        }`}>
          CARE • COMFORT • CONFIDENCE
        </span>
      </div>
    </Link>
  );
};
