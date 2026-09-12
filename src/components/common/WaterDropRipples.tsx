import React from 'react';

interface DropletConfig {
  x: string;
  y: string;
  size: number;
  duration: number;
  rings: { delay: number }[];
  showImpact?: boolean;
}

// Single centered water drop ripple origin ("ONLY ONE IN THE MIDDEL NOT TOOMANY")
const SINGLE_CENTER_DROPLET: DropletConfig = {
  x: '50%',
  y: '50%',
  size: 1150,
  duration: 8.0,
  showImpact: false, // No distracting bright dots, clean pure ripple circles
  rings: [
    { delay: 0.0 },
    { delay: 2.0 },
    { delay: 4.0 },
    { delay: 6.0 },
  ],
};

export const WaterDropRipples: React.FC<{ className?: string }> = ({ className = '' }) => {
  const drop = SINGLE_CENTER_DROPLET;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute"
        style={{
          left: drop.x,
          top: drop.y,
        }}
      >
        {/* Soft Ambient Radial Glow at Center */}
        <div
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 bg-[#DCA51B]/[0.06] blur-3xl pointer-events-none"
          style={{
            width: `${drop.size * 0.4}px`,
            height: `${drop.size * 0.4}px`,
          }}
        />

        {/* Concentric Water Drop Ripple Circles expanding from the middle */}
        {drop.rings.map((ring, ringIndex) => (
          <div
            key={`center-ring-${ringIndex}`}
            className="absolute rounded-full border border-[#DCA51B]/40 shadow-[0_0_12px_rgba(220,165,27,0.12),inset_0_0_8px_rgba(220,165,27,0.06)] animate-water-ripple pointer-events-none"
            style={{
              width: `${drop.size}px`,
              height: `${drop.size}px`,
              animationDuration: `${drop.duration}s`,
              animationDelay: `${ring.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
