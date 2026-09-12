import React from 'react';

interface AnimatedWaveContoursProps {
  className?: string;
  opacity?: string;
  strokeColor?: string;
}

// 5 mathematically periodic cubic bezier waves (period = 1440, repeated across 2880 for seamless infinite flow)
const PATH_1 = "M 0 158.0 C 80.0 173.7, 160.0 173.0, 240.0 170.0 C 320.0 166.9, 400.0 166.9, 480.0 170.0 C 560.0 173.0, 640.0 173.7, 720.0 158.0 C 800.0 142.3, 880.0 110.8, 960.0 92.0 C 1040.0 73.3, 1120.0 73.3, 1200.0 92.0 C 1280.0 110.8, 1360.0 142.3, 1440.0 158.0 C 1520.0 173.7, 1600.0 173.0, 1680.0 170.0 C 1760.0 166.9, 1840.0 166.9, 1920.0 170.0 C 2000.0 173.0, 2080.0 173.7, 2160.0 158.0 C 2240.0 142.3, 2320.0 110.8, 2400.0 92.0 C 2480.0 73.3, 2560.0 73.3, 2640.0 92.0 C 2720.0 110.8, 2800.0 142.3, 2880.0 158.0";

const PATH_2 = "M 0 245.9 C 80.0 245.7, 160.0 236.9, 240.0 234.6 C 320.0 232.3, 400.0 235.8, 480.0 230.3 C 560.0 224.8, 640.0 206.3, 720.0 185.7 C 800.0 165.0, 880.0 148.1, 960.0 153.8 C 1040.0 159.5, 1120.0 186.8, 1200.0 209.7 C 1280.0 232.7, 1360.0 246.1, 1440.0 245.9 C 1520.0 245.7, 1600.0 236.9, 1680.0 234.6 C 1760.0 232.3, 1840.0 235.8, 1920.0 230.3 C 2000.0 224.8, 2080.0 206.3, 2160.0 185.7 C 2240.0 165.0, 2320.0 148.1, 2400.0 153.8 C 2480.0 159.5, 2560.0 186.8, 2640.0 209.7 C 2720.0 232.7, 2800.0 246.1, 2880.0 245.9";

const PATH_3 = "M 0 312.0 C 80.0 302.5, 160.0 298.9, 240.0 297.7 C 320.0 296.5, 400.0 291.6, 480.0 274.0 C 560.0 256.3, 640.0 228.5, 720.0 220.0 C 800.0 211.5, 880.0 227.0, 960.0 254.1 C 1040.0 281.1, 1120.0 312.6, 1200.0 322.3 C 1280.0 331.9, 1360.0 321.4, 1440.0 312.0 C 1520.0 302.5, 1600.0 298.9, 1680.0 297.7 C 1760.0 296.5, 1840.0 291.6, 1920.0 274.0 C 2000.0 256.3, 2080.0 228.5, 2160.0 220.0 C 2240.0 211.5, 2320.0 227.0, 2400.0 254.1 C 2480.0 281.1, 2560.0 312.6, 2640.0 322.3 C 2720.0 331.9, 2800.0 321.4, 2880.0 312.0";

const PATH_4 = "M 0 363.6 C 80.0 357.9, 160.0 357.9, 240.0 350.4 C 320.0 342.9, 400.0 325.4, 480.0 311.9 C 560.0 298.5, 640.0 294.6, 720.0 309.5 C 800.0 324.5, 880.0 355.4, 960.0 374.5 C 1040.0 393.6, 1120.0 397.5, 1200.0 390.0 C 1280.0 382.6, 1360.0 369.2, 1440.0 363.6 C 1520.0 357.9, 1600.0 357.9, 1680.0 350.4 C 1760.0 342.9, 1840.0 325.4, 1920.0 311.9 C 2000.0 298.5, 2080.0 294.6, 2160.0 309.5 C 2240.0 324.5, 2320.0 355.4, 2400.0 374.5 C 2480.0 393.6, 2560.0 397.5, 2640.0 390.0 C 2720.0 382.6, 2800.0 369.2, 2880.0 363.6";

const PATH_5 = "M 0 418.9 C 80.0 415.4, 160.0 408.3, 240.0 394.6 C 320.0 380.9, 400.0 364.4, 480.0 367.8 C 560.0 371.3, 640.0 396.9, 720.0 424.1 C 800.0 451.2, 880.0 473.2, 960.0 473.2 C 1040.0 473.3, 1120.0 454.8, 1200.0 441.3 C 1280.0 427.9, 1360.0 422.4, 1440.0 418.9 C 1520.0 415.4, 1600.0 408.3, 1680.0 394.6 C 1760.0 380.9, 1840.0 364.4, 1920.0 367.8 C 2000.0 371.3, 2080.0 396.9, 2160.0 424.1 C 2240.0 451.2, 2320.0 473.2, 2400.0 473.2 C 2480.0 473.3, 2560.0 454.8, 2640.0 441.3 C 2720.0 427.9, 2800.0 422.4, 2880.0 418.9";

export const AnimatedWaveContours: React.FC<AnimatedWaveContoursProps> = ({
  className = '',
  opacity = 'opacity-25',
  strokeColor = '#DCA51B'
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${opacity} ${className}`}>
      <div className="absolute inset-0 w-full h-full animate-wave-flow-container">
        {/* Layer 1: Fast Surface Currents (22s continuous seamless flow) */}
        <svg 
          className="absolute top-0 bottom-0 left-0 w-[200%] h-full animate-wave-flow-fast" 
          viewBox="0 0 2880 600" 
          preserveAspectRatio="none" 
          fill="none"
        >
          <path 
            d={PATH_1} 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            vectorEffect="non-scaling-stroke" 
          />
          <path 
            d={PATH_3} 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            vectorEffect="non-scaling-stroke" 
          />
        </svg>

        {/* Layer 2: Medium Harmonic Currents (32s continuous seamless flow) */}
        <svg 
          className="absolute top-0 bottom-0 left-0 w-[200%] h-full animate-wave-flow-med" 
          viewBox="0 0 2880 600" 
          preserveAspectRatio="none" 
          fill="none"
        >
          <path 
            d={PATH_2} 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            vectorEffect="non-scaling-stroke" 
          />
          <path 
            d={PATH_4} 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            vectorEffect="non-scaling-stroke" 
          />
        </svg>

        {/* Layer 3: Deep Ambient Base Current (42s continuous seamless flow) */}
        <svg 
          className="absolute top-0 bottom-0 left-0 w-[200%] h-full animate-wave-flow-slow" 
          viewBox="0 0 2880 600" 
          preserveAspectRatio="none" 
          fill="none"
        >
          <path 
            d={PATH_5} 
            stroke={strokeColor} 
            strokeWidth="1.2" 
            vectorEffect="non-scaling-stroke" 
          />
        </svg>
      </div>
    </div>
  );
};
