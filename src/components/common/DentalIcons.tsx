import React from 'react';

export interface DentalIconProps {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  fill?: string;
}

/**
 * Clean Anatomical Tooth Icon
 */
export const ToothIcon: React.FC<DentalIconProps> = ({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  fill = 'none'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 3C4.5 3 3 5 3 8c0 3.5 1.5 6 3 10 .8 2.2 2 3 3.5 3 1.2 0 1.8-.8 2.5-2 .7 1.2 1.3 2 2.5 2 1.5 0 2.7-.8 3.5-3 1.5-4 3-6.5 3-10 0-3-1.5-5-4-5-2 0-3 1.5-4.5 1.5S9 3 7 3z" />
    <path d="M12 9v3" strokeWidth={strokeWidth - 0.5} opacity={0.6} />
  </svg>
);

/**
 * Tooth with Whitening Sparkle (Hygiene, Whitening, Aesthetics)
 */
export const ToothSparkleIcon: React.FC<DentalIconProps> = ({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  fill = 'none'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6.5 4C4.5 4 3 6 3 8.5c0 3 1.3 5.5 2.8 9.5.7 2 1.8 3 3.2 3 1.1 0 1.6-.8 2.2-2 .6 1.2 1.1 2 2.2 2 1.4 0 2.5-1 3.2-3 1.5-4 2.8-6.5 2.8-9.5 0-2.5-1.5-4.5-3.5-4.5-1.8 0-2.7 1.3-4.7 1.3S8.3 4 6.5 4z" />
    <path d="M19 2l.7 2.3L22 5l-2.3.7L19 8l-.7-2.3L16 5l2.3-.7z" fill="currentColor" stroke="none" />
    <circle cx="14" cy="2" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Dental Implant Icon (Fixture, Abutment & Crown)
 */
export const DentalImplantIcon: React.FC<DentalIconProps> = ({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  fill = 'none'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 3c-1.5 0-2.5 1-2.5 2.5 0 2 1 3.5 2 5.5h13c1-2 2-3.5 2-5.5C20.5 4 19.5 3 18 3c-1.8 0-2.5 1-6 1S7.8 3 6 3z" />
    <path d="M8 11h8v2H8z" />
    <path d="M9 13v7a3 3 0 0 0 6 0v-7" />
    <path d="M9 15h6" />
    <path d="M9 17h6" />
    <path d="M10 19h4" />
  </svg>
);

/**
 * Protective Dental Shield (Preventive Care, Enamel Protection, Hygiene)
 */
export const DentalShieldIcon: React.FC<DentalIconProps> = ({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  fill = 'none'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path 
      d="M9.5 8.5c-.8 0-1.5.5-1.5 1.5 0 1.2.6 2.2 1.3 3.6.3.7.8 1.1 1.4 1.1.5 0 .8-.4 1.3-.8.5.4.8.8 1.3.8.6 0 1.1-.4 1.4-1.1.7-1.4 1.3-2.4 1.3-3.6 0-1-.7-1.5-1.5-1.5-.8 0-1.2.6-2 .6s-1.2-.6-2-.6z" 
      strokeWidth={strokeWidth - 0.4}
    />
  </svg>
);

/**
 * Dental Crown & Veneer Icon (Restorative & Prosthodontics)
 */
export const DentalCrownIcon: React.FC<DentalIconProps> = ({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  fill = 'none'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 17l2-11 5 4 2-5 2 5 5-4 2 11H3z" />
    <path d="M3 17h18v3H3z" />
    <circle cx="5" cy="6" r="1" fill="currentColor" />
    <circle cx="12" cy="5" r="1" fill="currentColor" />
    <circle cx="19" cy="6" r="1" fill="currentColor" />
  </svg>
);

/**
 * 3D Optical Dental Scanner & Diagnostics Icon
 */
export const DentalScanIcon: React.FC<DentalIconProps> = ({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  fill = 'none'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 8V4h4" />
    <path d="M16 4h4v4" />
    <path d="M20 16v4h-4" />
    <path d="M8 20H4v-4" />
    <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2 2" strokeWidth={strokeWidth - 0.5} />
    <path 
      d="M9.5 8c-1 0-1.5.8-1.5 1.8 0 1.3.6 2.3 1.2 3.8.3.7.8 1 1.3 1 .5 0 .7-.4 1.1-.8.4.4.6.8 1.1.8.5 0 1-.3 1.3-1 .6-1.5 1.2-2.5 1.2-3.8 0-1-.5-1.8-1.5-1.8-.7 0-1.1.6-1.8.6s-1.1-.6-1.8-.6z" 
      strokeWidth={strokeWidth - 0.4}
    />
  </svg>
);

/**
 * Dental Mirror & Examination Explorer Icon
 */
export const DentalMirrorIcon: React.FC<DentalIconProps> = ({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  fill = 'none'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="15" cy="7" r="5" />
    <path d="M13 5c1 0 2.5 1 2.5 2.5" opacity={0.6} />
    <path d="M11.5 10.5L3 19l2 2 8.5-8.5" />
    <path d="M8 14l2 2" />
  </svg>
);

/**
 * Aesthetic Smile Curve Icon (Smile Makeovers & Cosmetic Harmony)
 */
export const SmileCurveIcon: React.FC<DentalIconProps> = ({
  className = 'w-6 h-6',
  size,
  strokeWidth = 2,
  fill = 'none'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 11c3 6 13 6 16 0" />
    <path d="M3 10c.8-.5 1.5-.5 2 0" />
    <path d="M19 10c.5-.5 1.2-.5 2 0" />
    <path d="M7 12.5c2 2.5 8 2.5 10 0" strokeWidth={strokeWidth - 0.6} opacity={0.7} />
  </svg>
);
