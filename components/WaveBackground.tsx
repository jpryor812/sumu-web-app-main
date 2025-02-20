import React, { ReactNode } from 'react';

interface WaveBackgroundProps {
  children: ReactNode;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Base background gradient */}
      <div className="absolute inset-0">
        {/* First animated wave */}
        <div 
          className="absolute inset-0 animate-wave-slow opacity-70"
          style={{
            backgroundImage: `
              radial-gradient(
                ellipse at 50% 50%,
                rgba(0, 255, 128, 0.15) 0%,
                rgba(0, 80, 40, 0.12) 40%,
                transparent 70%
              )
            `,
            transform: 'scale(1.2)',
          }}
        />
        
        {/* Second animated wave */}
        <div 
          className="absolute inset-0 animate-wave-medium opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 70% 50%,
                rgba(0, 255, 128, 0.12) 0%,
                rgba(0, 80, 40, 0.1) 35%,
                transparent 65%
              )
            `,
            transform: 'scale(1.5)',
          }}
        />
        
        {/* Third animated wave */}
        <div 
          className="absolute inset-0 animate-wave-fast opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 30% 50%,
                rgba(0, 255, 128, 0.1) 0%,
                rgba(0, 80, 40, 0.08) 30%,
                transparent 60%
              )
            `,
            transform: 'scale(1.3)',
          }}
        />
      </div>

      {/* Noise overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default WaveBackground;