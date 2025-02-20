import React, { ReactNode } from 'react';

interface FloatingBackgroundProps {
  children: ReactNode;
}

const FloatingBackground: React.FC<FloatingBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0">
        {/* Large slow-floating gradient */}
        <div 
          className="absolute inset-0 animate-float-fast"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at center,
                rgba(0, 255, 128, 0.15) 0%,
                rgba(0, 80, 40, 0.1) 45%,
                transparent 70%
              )
            `,
          }}
        />
        
        {/* Medium floating gradient */}
        <div 
          className="absolute inset-0 animate-float-medium opacity-75"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at center,
                rgba(0, 255, 128, 0.12) 0%,
                rgba(0, 80, 40, 0.08) 40%,
                transparent 65%
              )
            `,
          }}
        />
        
        {/* Smaller faster-floating gradient */}
        <div 
          className="absolute inset-0 animate-float-fast opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at center,
                rgba(0, 255, 128, 0.1) 0%,
                rgba(0, 80, 40, 0.06) 35%,
                transparent 60%
              )
            `,
          }}
        />
      </div>

      {/* Noise overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FloatingBackground;