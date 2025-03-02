'use client'

import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2 } from 'lucide-react';
import Image from 'next/image';

interface RecommendationData {
  creator: string;
  creatorImage: string;
  description: string;
  recCreator1: string;
  recCreator2?: string;
  recCreator3?: string;
  recommendation: string;
}

const RecommendationCard: React.FC<RecommendationData> = ({
  creator,
  creatorImage,
  description,
  recCreator1,
  recCreator2,
  recCreator3,
  recommendation,
}) => {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Image 
            src={creatorImage} 
            alt={creator} 
            width={36}
            height={36}
            className="rounded-full object-cover aspect-square" 
          />
          <h3 className="font-semibold text-gray-100 text-sm sm:text-md">{creator}</h3>
        </div>
        <button className="sm:w-24 w-20 px-1 py-2 sm:px-1 sm:py-2 rounded-full bg-green-600 text-xs sm:text-xs font-semibold text-gray-100 hover:bg-green-800 transition-colors">
          View Page
        </button>
      </div>
      <div className="py-2 px-2">
        <p className="text-gray-200 font-semibold text-xs sm:text-xs">{description}</p>
      </div>
      <div className="flex items-center mt-4 gap-8 sm:gap-4 md:gap-2">
        <div className="flex -space-x-2">
          <Image 
            src={recCreator1} 
            alt="Recommender 1" 
            width={32}
            height={32}
            className="rounded-full border-2 border-white object-cover aspect-square" 
          />
          {recCreator2 && (
            <Image 
              src={recCreator2} 
              alt="Recommender 2" 
              width={32}
              height={32}
              className="rounded-full border-2 border-white object-cover aspect-square" 
            />
          )}
          {recCreator3 && (
            <Image 
              src={recCreator3} 
              alt="Recommender 3" 
              width={32}
              height={32}
              className="rounded-full border-2 border-white object-cover aspect-square" 
            />
          )}
        </div>
        <p className="text-xs pl-6 pr-1 text-gray-400 font-semibold">{recommendation}</p>
      </div>
    </div>
  );
};

interface RecommendationComponentProps {
  type: 'following' | 'mutual';
}

export default function RecommendationComponent({ type }: RecommendationComponentProps) {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const followingData: RecommendationData[] = [
    {
      creator: 'Blockchain Bobby',
      creatorImage: '/profile2-500x500.png',
      description: "I'm a Web3 developer building apps on the blockchain",
      recCreator1: '/alex-profile.png',
      recCreator2: '/profile_picture.jpg',
      recommendation: 'Recommended by Alex Dethero and Just-in Trades'
    },
    {
      creator: 'McStickies',
      creatorImage: '/mcStickies-1.png',
      description: "Creating custom stickers for teachers, animal lovers, and brands.",
      recCreator1: '/alex-profile.png',
      recCreator2: '/puja_picture.png',
      recommendation: 'Recommended by Alex Dethero and Healed by Heels'
    },
    {
      creator: 'Life Through Lenses',
      creatorImage: '/profile-800x800.png',
      description: "Photographer and digital artists documenting my journey in Europe.",
      recCreator1: '/profile_picture.jpg',
      recommendation: 'Recommended by Just-in Trades'
    },
  ];

  const mutualFansData: RecommendationData[] = [
    {
      creator: 'Just-in Trades',
      creatorImage: '/profile_picture.jpg',
      description: "Sharing tips on how to profitably invest in crypto",
      recCreator1: '/photo-1.jpeg',
      recCreator2: '/photo-2.jpeg',
      recCreator3: '/photo-3.jpeg',
      recommendation: 'Recommended by Fans of Alex Dethero'
    },
    {
      creator: 'Alex Dethero',
      creatorImage: '/alex-profile.png',
      description: "Lo-fi hip-hop beat musician",
      recCreator1: '/photo-4.jpeg',
      recCreator2: '/photo-5.jpg',
      recommendation: 'Recommended by Fans of Just-in Trades'
    },
    {
      creator: 'Coding with Courtney',
      creatorImage: '/photo-8.jpg',
      description: "Group and private coding lessons",
      recCreator1: '/photo-7.jpg',
      recCreator2: '/photo-6.jpg',
      recommendation: 'Recommended by Fans of Techno-Tony'
    },
  ];

  const data = type === 'following' ? followingData : mutualFansData;

  return (
    <div ref={componentRef} className="bg-transparent">
      <div className="space-y-4">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="transition-all duration-500 ease-in-out bg-gray-900 rounded-lg p-4" 
            style={{
              opacity: 1,
              transform: 'translateY(0)',
              transitionDelay: `${index * 150}ms`
            }}
          >
            <RecommendationCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
} 