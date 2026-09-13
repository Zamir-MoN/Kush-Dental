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
  const imgSizeClass = size === 'sm' 
    ? 'w-8 h-8' 
    : size === 'lg' 
    ? 'w-12 h-12 sm:w-14 sm:h-14' 
    : 'w-9 h-9 sm:w-10 sm:h-10';
  
  return (
    <Link to="/" className={`flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none ${className}`}>
      {/* Official Dental Tooth Mark with High-Contrast Luxury Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img 
          src="/favicon-512.png" 
          alt="Kush Dental Clinic Logo" 
          className={`${imgSizeClass} object-contain rounded-xl shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(220,165,27,0.4)]`}
        />
      </div>

      {/* Brand Typography in Elegant Serif & Minimal Luxury Hierarchy */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-baseline gap-1 sm:gap-1.5 leading-none">
          <span 
            className={`font-serif font-bold tracking-tight transition-colors ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-[15px] sm:text-[19px]'
            } ${isDark ? 'text-white' : 'text-[#141518]'}`}
          >
            Kush Dental
          </span>
          <span 
            className={`font-serif font-normal italic ${
              size === 'sm' ? 'text-[11px]' : size === 'lg' ? 'text-lg' : 'text-xs sm:text-sm'
            } text-[#DCA51B]`}
          >
            Clinic
          </span>
        </div>
        <span 
          className={`font-sans font-medium tracking-[0.16em] sm:tracking-[0.2em] uppercase leading-tight ${
            size === 'sm' ? 'text-[6.5px]' : size === 'lg' ? 'text-[9.5px]' : 'text-[7px] sm:text-[8px]'
          } text-zinc-400 mt-0.5`}
        >
          Precision Dentistry
        </span>
      </div>
    </Link>
  );
};
