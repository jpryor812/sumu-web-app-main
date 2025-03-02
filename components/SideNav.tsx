'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Trophy, LayoutDashboard, User, Users, TrendingUp, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
    { icon: TrendingUp, label: 'Stats and Earnings', href: '/dashboard' },
    { icon: User, label: 'My Page', href: '/creator' },
    { icon: Users, label: 'Subscribers', href: '/subscribers', notifications: 1 },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-gray-500 backdrop-blur-sm z-40"
          onClick={() => setIsMobile(false)}
        />
      )}

      <div className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 flex flex-col
        ${isMobile ? 'w-16' : 'w-64'} 
        ${isMobile ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Main Navigation */}
        <div className="flex-1 flex flex-col p-4 space-y-6">
          {/* Logo */}
          <Link href="/" className="mb-8 flex justify-center">
            <Image
              src="/Sumu-logo.png"
              alt="Sumu Logo"
              width={isMobile ? 32 : 120}
              height={isMobile ? 32 : 40}
              className="transition-all duration-300"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800 transition-colors ${
                    isActive ? 'bg-gray-800' : ''
                  } relative`}
                >
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                    {item.notifications && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {item.notifications}
                      </div>
                    )}
                  </div>
                  {!isMobile && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile Section */}
        <Link 
          href="/creator" 
          className={`p-4 border-t border-gray-800 bg-gray-800/50 flex items-center justify-between hover:bg-gray-800 transition-colors
            ${isMobile ? 'space-x-0' : 'space-x-3'}`}
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
            {!isMobile && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-white font-medium truncate">User Journeys</p>
                <p className="text-gray-400 text-sm truncate">Creator</p>
              </div>
            )}
          </div>
        </Link>
      </div>
    </>
  );
}