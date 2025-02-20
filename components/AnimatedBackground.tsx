'use client'

import React, { useEffect, useState, CSSProperties } from 'react';

interface OrbPosition {
  left: string;
  top: string;
}

interface Orb {
  id: number;
  delay: string;
  duration: string;
  position: OrbPosition;
  gradientClass: string;
}

interface CustomCSSProperties extends CSSProperties {
  '--translate-x1': string;
  '--translate-y1': string;
  '--translate-x2': string;
  '--translate-y2': string;
}

const AnimatedBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const orbPositions: OrbPosition[] = [
    { left: '10%', top: '10%' },
    { left: '30%', top: '20%' },
    { left: '50%', top: '15%' },
    { left: '70%', top: '25%' },
    { left: '90%', top: '10%' },
    { left: '20%', top: '60%' },
    { left: '40%', top: '70%' },
    { left: '60%', top: '80%' },
    { left: '80%', top: '65%' },
    { left: '15%', top: '40%' },
    { left: '45%', top: '45%' },
    { left: '75%', top: '50%' }
  ];

  const generateOrbs = (length: number): Orb[] => {
    return Array.from({ length }).map((_, index) => ({
      id: index,
      delay: `${index * 3}s`,
      duration: `${20 + index * 5}s`,
      position: orbPositions[index % orbPositions.length],
      gradientClass: index % 4 === 0 ? 'gradient-gold' : 
                    index % 4 === 1 ? 'gradient-blue' : 
                    index % 4 === 2 ? 'gradient-green' :
                    'gradient-pink'
    }));
  };

  const orbs = generateOrbs(12); // Increased number of orbs for more coverage

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full ${orb.gradientClass} blur-3xl`}
          style={{
            width: '40rem',
            height: '40rem',
            animation: `float ${orb.duration} ease-in-out infinite`,
            animationDelay: orb.delay,
            left: orb.position.left,
            top: orb.position.top,
            '--translate-x1': '30%',
            '--translate-y1': '30%',
            '--translate-x2': '-20%',
            '--translate-y2': '20%',
          } as CustomCSSProperties}
        />
      ))}
      <style jsx>{`
        .gradient-gold {
          background: linear-gradient(40deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 214, 109, 0.6) 20%,
            rgba(255, 255, 255, 0.6) 40%,
            rgba(255, 214, 109, 0.6) 60%,
            rgba(255, 255, 255, 0.6) 80%,
            rgba(255, 214, 109, 0.6) 100%
          );
          background-size: 300% 100%;
          animation: moveGradient 5s alternate infinite;
        }

        .gradient-pink {
          background: linear-gradient(40deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(244, 114, 182, 0.6) 20%,
            rgba(255, 255, 255, 0.6) 40%,
            rgba(244, 114, 182, 0.6) 60%,
            rgba(255, 255, 255, 0.6) 80%,
            rgba(244, 114, 182, 0.6) 100%
          );
          background-size: 300% 100%;
          animation: moveGradient 5s alternate infinite;
        }

        .gradient-blue {
          background: linear-gradient(40deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(96, 165, 250, 0.6) 20%,
            rgba(255, 255, 255, 0.6) 40%,
            rgba(96, 165, 250, 0.6) 60%,
            rgba(255, 255, 255, 0.6) 80%,
            rgba(96, 165, 250, 0.6) 100%
          );
          background-size: 300% 100%;
          animation: moveGradient 5s alternate infinite;
        }

        .gradient-green {
          background: linear-gradient(40deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(52, 211, 153, 0.6) 20%,
            rgba(255, 255, 255, 0.6) 40%,
            rgba(52, 211, 153, 0.6) 60%,
            rgba(255, 255, 255, 0.6) 80%,
            rgba(52, 211, 153, 0.6) 100%
          );
          background-size: 300% 100%;
          animation: moveGradient 5s alternate infinite;
        }

        @keyframes moveGradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(var(--translate-x1), var(--translate-y1)) scale(1.1);
          }
          66% {
            transform: translate(var(--translate-x2), var(--translate-y2)) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;