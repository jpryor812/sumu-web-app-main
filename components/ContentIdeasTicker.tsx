'use client'

import React from 'react';
import { motion } from 'framer-motion';

const ContentIdeasTicker: React.FC = () => {
  const items = [
    "Investment Tips",
    "Art Raffles",
    "Early Access to Future Public Content",
    "Discounts",
    "Exclusive Group Chats"
  ];

  const itemsReverse = [
    "Fan-Only Vlogs",
    "Q&A's about your Work",
    "Sell a Course",
    "Host Fan Meet-Ups",
    "Live Performances"
  ];

  return (
    <div className="w-full bg-black/20">
      {/* First line - moving left */}
      <div className="w-full overflow-hidden py-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -1000],
          }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {[...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-white text-xl mx-4">{item}</span>
              <span className="text-white/50 text-xl">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second line - moving right */}
      <div className="w-full overflow-hidden py-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [-1000, 0], // Reversed animation direction
          }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {[...itemsReverse, ...itemsReverse].map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-white text-xl mx-4">{item}</span>
              <span className="text-white/50 text-xl">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentIdeasTicker;