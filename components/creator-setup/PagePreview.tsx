'use client'

import Image from "next/image";
import { Tier } from '@/app/signup/creator-setup/page';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useState, useMemo } from 'react';

interface PagePreviewProps {
  formData: {
    bio: string;
    bannerImage: File | null;
    profileMedia: File | null;
    isProfileVideo: boolean;
    videoOrientation?: number;
  };
  tiers: Tier[];
  onClose: () => void;
  isOpen?: boolean;
  userName?: string;
}

export default function PagePreview({ formData, tiers, onClose, isOpen = true, userName }: PagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 3;
  const hasMoreCards = currentIndex + cardsToShow < tiers.length;
  const canScrollBack = currentIndex > 0;
  const [isPlaying, setIsPlaying] = useState(false);

  // Memoize the media URL
  const mediaUrl = useMemo(() => {
    if (!formData.profileMedia) return null;
    return URL.createObjectURL(formData.profileMedia);
  }, [formData.profileMedia]);

  const scroll = (direction: 'left' | 'right') => {
    setCurrentIndex(prev => {
      if (direction === 'left') {
        return Math.max(0, prev - 1);
      } else {
        return Math.min(tiers.length - cardsToShow, prev + 1);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 p-2 text-gray-400 hover:text-white bg-gray-800 rounded-full z-10"
          >
            <X size={24} />
          </button>

          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="w-full h-[200px] relative bg-gray-800">
              {formData.bannerImage ? (
                <Image
                  src={URL.createObjectURL(formData.bannerImage)}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800" />
              )}
            </div>

            <div className="flex justify-center -mt-16 px-8">
              <div className="relative w-36 h-36 rounded-full border-4 border-gray-900 bg-gray-800">
                {formData.profileMedia && mediaUrl ? (
                  formData.isProfileVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        src={mediaUrl}
                        style={{ 
                          transform: `rotate(${formData.videoOrientation || 0}deg)`,
                          objectFit: 'cover'
                        }}
                        className="w-full h-full rounded-full object-cover"
                        playsInline
                        ref={(videoEl) => {
                          if (videoEl) {
                            if (isPlaying) {
                              videoEl.play();
                            } else {
                              videoEl.pause();
                            }
                          }
                        }}
                        onEnded={() => setIsPlaying(false)}
                      />
                      {!isPlaying && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsPlaying(true);
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-20 rounded-full"
                        >
                          <Play className="w-12 h-12 text-white" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-800" />
                )}
              </div>
            </div>

            <div className="flex flex-col items-center px-8 py-4">
              <h2 className="text-2xl font-bold text-white mb-2">
                {userName || "Your Name"}
              </h2>
              <p className="text-gray-300 text-center text-sm max-w-2xl mb-8">
                {formData.bio || "Your bio will appear here..."}
              </p>

              <h3 className="text-xl font-semibold text-white mb-6">
                Choose Your Membership
              </h3>

              <div className="relative">
                {/* Navigation Arrows */}
                {canScrollBack && (
                  <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                {hasMoreCards && (
                  <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}

                {/* Cards Container */}
                <div className="overflow-hidden px-8">
                  <div 
                    className="flex gap-8 transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
                  >
                    {tiers.map((tier, index) => (
                      <div 
                        key={index}
                        className="w-full min-w-[calc(33% - 1rem)]"
                      >
                        <div className="bg-gray-800 p-8 rounded-xl border-2 border-[#4040FF] flex flex-col h-full">
                          <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                          <div className="flex items-baseline mb-4">
                            <span className="text-3xl font-bold text-white">${tier.price}</span>
                            <span className="text-gray-400 ml-1">/month</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 mb-4">{tier.description}</p>
                            <ul className="space-y-2">
                              {tier.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center text-gray-300">
                                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button className="w-full mt-6 bg-[#4040FF] text-white py-2 rounded-lg font-semibold hover:bg-[#3030DD] transition-colors">
                            Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center w-full mt-8">
                <div className="flex items-center justify-between bg-[#4040FF] rounded-full p-1 w-80">
                  <span className="text-white font-semibold px-4 py-2">Share with a friend</span>
                  <button className="bg-white text-black px-8 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 