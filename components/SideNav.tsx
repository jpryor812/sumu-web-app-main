'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Share2, Bell, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

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
          className="fixed inset-0 gray-500 z-20"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div className={`fixed left-0 top-0 h-full gray-500 border-r border-gray-800 transition-all duration-300 z-30
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-8 bg-gray-500 rounded-full p-1 hover:bg-gray-700 transition-colors
            ${isMobile && isCollapsed ? 'right-0 translate-x-full' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="flex flex-col p-4 space-y-6">
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
              <Share2 size={20} />
              {!isCollapsed && <span>Explore</span>}
            </Link>
            <Link href="/notifications" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <Bell size={20} />
              {!isCollapsed && <span>Notifications</span>}
            </Link>
            <Link href="/settings" className="flex items-center space-x-3 text-gray-300 hover:text-white px-2">
              <Settings size={20} />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </nav>

          {/* Recently Visited - only show when expanded */}
          {!isCollapsed && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">Recently Visited</h3>
              <div className="space-y-3">
                {/* Add recent creators here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}