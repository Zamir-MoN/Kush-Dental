import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

// 7 exact vector contours extracted from the official Kush Dental Clinic logo
const LOGO_PATHS = [
  // 1. Top left crown crest & flowing hair brush strokes
  "M 155.0 58.0 L 170.0 59.0 L 183.0 63.0 L 217.0 83.0 L 230.0 88.0 L 246.0 91.0 L 218.0 89.0 L 183.0 73.0 L 166.0 69.0 L 153.0 69.0 L 138.0 73.0 L 123.0 81.0 L 112.0 91.0 L 104.0 107.0 L 100.0 124.0 L 99.0 164.0 L 104.0 204.0 L 113.0 241.0 L 99.0 244.0 L 90.0 210.0 L 83.0 165.0 L 83.0 129.0 L 86.0 113.0 L 93.0 95.0 L 110.0 75.0 L 131.0 63.0 L 155.0 58.0 Z",
  
  // 2. Top right crown crest, top dip & right root outline
  "M 334.0 69.0 L 359.0 69.0 L 384.0 79.0 L 403.0 97.0 L 412.0 113.0 L 416.0 127.0 L 415.0 174.0 L 401.0 247.0 L 369.0 361.0 L 355.0 400.0 L 349.0 413.0 L 345.0 417.0 L 342.0 417.0 L 340.0 414.0 L 343.0 393.0 L 372.0 304.0 L 388.0 241.0 L 398.0 190.0 L 402.0 156.0 L 402.0 134.0 L 400.0 123.0 L 394.0 109.0 L 374.0 90.0 L 356.0 83.0 L 340.0 82.0 L 327.0 85.0 L 305.0 95.0 L 277.0 115.0 L 252.0 129.0 L 222.0 138.0 L 198.0 139.0 L 181.0 136.0 L 163.0 129.0 L 147.0 118.0 L 167.0 128.0 L 184.0 132.0 L 210.0 133.0 L 227.0 130.0 L 247.0 123.0 L 250.0 121.0 L 249.0 120.0 L 215.0 127.0 L 194.0 126.0 L 181.0 123.0 L 161.0 114.0 L 149.0 105.0 L 164.0 113.0 L 190.0 120.0 L 221.0 120.0 L 239.0 115.0 L 215.0 116.0 L 188.0 112.0 L 170.0 104.0 L 150.0 88.0 L 172.0 101.0 L 192.0 107.0 L 206.0 109.0 L 235.0 108.0 L 265.0 100.0 L 320.0 73.0 L 334.0 69.0 Z",
  
  // 3. Left Square Eye
  "M 177.0 195.0 L 196.0 195.0 L 195.0 215.0 L 177.0 215.0 L 177.0 195.0 Z",
  
  // 4. Right Square Eye
  "M 314.0 195.0 L 333.0 196.0 L 332.0 215.0 L 313.0 215.0 L 314.0 195.0 Z",
  
  // 5. Warm Curved Smile Arc
  "M 186.0 236.0 L 190.0 236.0 L 194.0 240.0 L 196.0 259.0 L 206.0 279.0 L 221.0 293.0 L 232.0 299.0 L 246.0 303.0 L 268.0 302.0 L 290.0 291.0 L 302.0 279.0 L 308.0 270.0 L 312.0 262.0 L 317.0 239.0 L 321.0 236.0 L 326.0 237.0 L 328.0 240.0 L 328.0 248.0 L 322.0 271.0 L 313.0 287.0 L 303.0 298.0 L 292.0 306.0 L 273.0 314.0 L 248.0 316.0 L 233.0 313.0 L 215.0 305.0 L 196.0 288.0 L 188.0 275.0 L 183.0 257.0 L 182.0 240.0 L 186.0 236.0 Z",
  
  // 6. Lower Left Root Apex Wall
  "M 117.0 260.0 L 120.0 260.0 L 124.0 283.0 L 139.0 324.0 L 155.0 355.0 L 187.0 403.0 L 188.0 410.0 L 186.0 412.0 L 181.0 411.0 L 174.0 406.0 L 160.0 389.0 L 142.0 361.0 L 125.0 329.0 L 113.0 299.0 L 104.0 269.0 L 104.0 265.0 L 117.0 260.0 Z",
  
  // 7. Center Root Apex Arch (Inverted V cleft)
  "M 253.0 359.0 L 262.0 361.0 L 272.0 370.0 L 283.0 386.0 L 297.0 414.0 L 280.0 414.0 L 268.0 390.0 L 262.0 381.0 L 254.0 374.0 L 249.0 382.0 L 242.0 414.0 L 230.0 414.0 L 232.0 398.0 L 239.0 373.0 L 243.0 366.0 L 249.0 360.0 L 253.0 359.0 Z"
];

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  className = "w-16 h-16", 
  size = 90,
  animate = true 
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 500 500"
        width={size}
        height={size}
        className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(220,165,27,0.22)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="kush-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D77F" />
            <stop offset="45%" stopColor="#DCA51B" />
            <stop offset="100%" stopColor="#C49216" />
          </linearGradient>
          <linearGradient id="kush-gold-light" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DFBE7A" />
            <stop offset="100%" stopColor="#DCA51B" />
          </linearGradient>
        </defs>

        {/* 1. Left Crown Crest & Hair Swoosh */}
        <motion.path
          d={LOGO_PATHS[0]}
          fill="url(#kush-gold-gradient)"
          initial={animate ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
          animate={animate ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* 2. Right Crown Crest, Top Valley & Right Root Contour */}
        <motion.path
          d={LOGO_PATHS[1]}
          fill="url(#kush-gold-gradient)"
          initial={animate ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
          animate={animate ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        />

        {/* 3. Left Square Eye */}
        <motion.path
          d={LOGO_PATHS[2]}
          fill="url(#kush-gold-gradient)"
          initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={animate ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        />

        {/* 4. Right Square Eye */}
        <motion.path
          d={LOGO_PATHS[3]}
          fill="url(#kush-gold-gradient)"
          initial={animate ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={animate ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        />

        {/* 5. Warm Curved Smile Arc */}
        <motion.path
          d={LOGO_PATHS[4]}
          fill="url(#kush-gold-gradient)"
          initial={animate ? { opacity: 0, scale: 0.85, y: -4 } : { opacity: 1, scale: 1, y: 0 }}
          animate={animate ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
        />

        {/* 6. Lower Left Root Apex */}
        <motion.path
          d={LOGO_PATHS[5]}
          fill="url(#kush-gold-gradient)"
          initial={animate ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
          animate={animate ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        />

        {/* 7. Center Root Cleft Arch */}
        <motion.path
          d={LOGO_PATHS[6]}
          fill="url(#kush-gold-gradient)"
          initial={animate ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
          animate={animate ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.65, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};
