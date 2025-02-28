'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lock, UnlockKeyhole, MessageCircle, Share2 } from 'lucide-react';

// Add interface for comment structure
interface Comment {
  username: string;
  text: string;
  timestamp: string;
}

interface LockedPostProps {
  title: string;
  subtitle: string;
  date: string;
  image: string;
  comments: Comment[];  // Changed to array of Comment objects
  isSubscribed?: boolean;
}

export default function LockedPost({
  title,
  date,
  subtitle, 
  image,
  comments,
  isSubscribed = false
}: LockedPostProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="flex justify-center w-full">
      <div 
        className="w-full max-w-2xl bg-[#1A1B1F] rounded-xl overflow-hidden border-4 border-white relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-video">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-50"
          />
          {!isSubscribed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative transition-transform duration-500 transform group-hover:-translate-y-4">
                {isHovered ? (
                  <UnlockKeyhole className="w-48 h-48 transition-opacity duration-500" />
                ) : (
                  <Lock className="w-48 h-48 transition-opacity duration-500" />
                )}
              </div>
              <button 
                className={`
                  transition-all duration-500 transform
                  ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  px-6 py-3 bg-[#4040FF] backdrop-blur-sm rounded-full
                  hover:bg-[#00BBFF] text-3xl font-semibold text-white mt-4
                  border border-white/20 shadow-lg
                  flex items-center gap-2
                `}
              >
                Join to Unlock
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-base text-gray-300 mb-2">{subtitle}</p>
          <p className="text-gray-400 mb-4">{date}</p>

          {!isSubscribed && (
            <button className="w-full bg-[#00BF63] hover:bg-[#00EE3F] text-white text-xl font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-6">
              <Lock className="w-6 h-6" />
              Join to unlock
            </button>
          )}

          {/* Engagement Bar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{comments.length} {showComments ? 'Hide' : 'Show'} Comments</span>
              </button>
            </div>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-6 space-y-4 border-t border-gray-700 pt-4">
              {comments.map((comment, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{comment.username}</span>
                    <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}