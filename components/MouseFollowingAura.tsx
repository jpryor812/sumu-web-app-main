'use client'

import React, { useState, useEffect, ReactNode } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface MouseFollowingAuraProps {
  children: ReactNode;
}

const MouseFollowingAura: React.FC<MouseFollowingAuraProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-black"
      style={{
        backgroundImage: `
          radial-gradient(
            circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(0, 255, 128, 0.15) 0%,
            rgba(0, 80, 40, 0.15) 25%,
            rgba(0, 40, 20, 0.1) 50%,
            transparent 100%
          ),
          radial-gradient(
            circle at 80% 20%,
            rgba(0, 255, 128, 0.1) 0%,
            rgba(0, 80, 40, 0.1) 30%,
            transparent 70%
          ),
          radial-gradient(
            circle at 20% 80%,
            rgba(0, 255, 128, 0.1) 0%,
            rgba(0, 80, 40, 0.1) 30%,
            transparent 70%
          )
        `
      }}
    >
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />
      
      {children}
    </div>
  );
};

export default MouseFollowingAura;