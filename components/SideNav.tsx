'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, MessageCircle, Bell, Repeat2, ChevronLeft, ChevronRight, MoreVertical, Trophy, Users, BarChart } from 'lucide-react';

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Backdrop for mobile */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-gray-500 backdrop-blur-sm z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-8 bg-black rounded-full p-1 hover:bg-gray-900 transition-colors
            ${isMobile && isCollapsed ? 'right-0 translate-x-full' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Main Navigation */}
        <div className="flex-1 flex flex-col p-4 space-y-6">
          {/* Logo */}
          <Link href="/" className="mb-8 flex justify-center">
            <Image
              src="/Sumu-logo.png"
              alt="Sumu Logo"
              width={isCollapsed ? 32 : 120}
              height={isCollapsed ? 32 : 40}
              className="transition-all duration-300"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <Home size={20} />
              {!isCollapsed && <span>Home</span>}
            </Link>
            <Link href="/explore" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <MessageCircle size={20} />
              {!isCollapsed && <span>Chat</span>}
            </Link>
            <Link href="/notifications" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <Bell size={20} />
              {!isCollapsed && <span>Notifications</span>}
            </Link>
            <Link href="/settings" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <Repeat2 size={20} />
              {!isCollapsed && <span>Recommendations</span>}
            </Link>
            <Link href="/leaderboard" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <Trophy size={20} />
              {!isCollapsed && <span>Leaderboard</span>}
            </Link>
            <Link href="/leaderboard" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <BarChart size={20} />
              {!isCollapsed && <span>Stats and Rewards</span>}
            </Link>
            <Link href="/leaderboard" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <BarChart size={20} />
              {!isCollapsed && <span>Subscribers (just a list, when they joined, their tier, and an option to message or block them)</span>}
            </Link>
            <Link href="/referrals" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <Users size={20} />
              {!isCollapsed && <span>Referrals</span>}
            </Link>
          </nav>
        </div>

        {/* Profile Section */}
        <div className={`p-4 border-t border-gray-800 bg-gray-800/50 flex items-center justify-between
          ${isCollapsed ? 'space-x-0' : 'space-x-3'}`}
        >
          <div className="flex items-center min-w-0">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/profile_picture.jpg"
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-white font-medium truncate">User Journeys</p>
                <p className="text-gray-400 text-sm truncate">Creator</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="p-1 hover:bg-gray-700 rounded-full transition-colors">
              <MoreVertical size={20} className="text-gray-300" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}