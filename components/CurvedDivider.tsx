import React from 'react';

const CurvedDivider = () => {
  return (
    <div className="w-full flex justify-center py-8">
      <svg width="100" height="120" viewBox="0 0 100 120">
        {/* Define the gradient */}
        <defs>
          <linearGradient id="shinePath" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="33%" stopColor="#FFD66D" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="67%" stopColor="#FFD66D" />
            <stop offset="100%" stopColor="#FFFFFF" />
            
            {/* Animate the gradient */}
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1"
              to="1"
              dur="5s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* Curved path with animated gradient */}
        <path
          d="M50,0 
             C25,20 75,40 50,60 
             C25,80 75,100 50,120"
          stroke="url(#shinePath)"
          strokeWidth="3"
          strokeDasharray="5,5"
          fill="none"
        />
        
        {/* Arrow at the bottom */}
        <path
          d="M45,115 L50,120 L55,115"
          stroke="url(#shinePath)"
          strokeWidth="3"
          strokeDasharray="0"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default CurvedDivider;