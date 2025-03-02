'use client'

import { useState } from 'react';
import SideNav from '@/components/SideNav';
import { Search } from 'lucide-react';
import NewPostsHome from './NewPostsHome';
import SocialFeed from './SocialFeed';
import Recommendations from './Recommendations';
import RecommendationComponent from './Recommendations';

export default function HomePage() {
  const categories = ['All', 'Art', 'Music', 'Finance', 'Gaming', 'Tech', 'Fashion', 'World Affairs'];
  
  // Separate states for top section
  const [topFollowingOnly, setTopFollowingOnly] = useState(false);
  
  // Separate states for explore section
  const [exploreFollowingOnly, setExploreFollowingOnly] = useState(false);
  const [exploreMostRecent, setExploreMostRecent] = useState(true);
  
  // Category states
  const [topActiveCategory, setTopActiveCategory] = useState('All');
  const [exploreActiveCategory, setExploreActiveCategory] = useState('All');

  return (
    <div className="flex">
      {/* SideNav will be fixed */}
      <SideNav />
      
      {/* Main content area with its own scrolling */}
      <main className="flex-1 min-h-screen ml-16 md:ml-64 overflow-y-auto">
        <div className="py-6 px-2">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search for creators by name or topic"
              className="w-full py-3 px-6 rounded-full bg-white/90 text-gray-800 placeholder-gray-600"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
          </div>

          {/* Top Category Navigation */}
          <nav className="mb-12">
            <ul className="flex space-x-8 justify-center">
              {categories.map((category) => (
                <li key={category}>
                  <button 
                    onClick={() => setTopActiveCategory(category)}
                    className={`text-white text-md font-semibold hover:text-green-300 ${
                      category === topActiveCategory ? 'border-b-2 border-purple-500' : ''
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Top Toggle Section */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center text-sm space-x-4">
              <span className={`font-medium ${!topFollowingOnly ? 'text-green-400 font-semibold' : 'font-semibold text-white'}`}>
                All Creators
              </span>
              <button
                onClick={() => setTopFollowingOnly(!topFollowingOnly)}
                className="w-12 h-6 bg-gray-600 rounded-full relative transition-colors"
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ease-in-out
                    ${topFollowingOnly ? 'translate-x-7 left-0' : 'translate-x-1'}`}
                />
              </button>
              <span className={`font-medium ${topFollowingOnly ? 'text-green-400 font-semibold' : 'text-white'}`}>
                Following
              </span>
            </div>
          </div>

          {/* New Posts Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">New Posts</h2>
            <NewPostsHome />
          </section>

          {/* Explore Section */}
          <section>
            <h2 className="text-2xl font-bold text-center text-white mb-8">Explore</h2>
            {/* Explore Category Navigation */}
            <nav className="mb-8">
              <ul className="flex space-x-8 justify-center">
                {categories.map((category) => (
                  <li key={category}>
                    <button 
                      onClick={() => setExploreActiveCategory(category)}
                      className={`text-white text-md font-semibold hover:text-green-300 ${
                        category === exploreActiveCategory ? 'border-b-2 border-purple-500' : ''
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Explore Toggle Filters */}
            <div className="flex gap-16 justify-center items-center mb-8">
              <div className="flex items-center text-sm space-x-4">
                <span className={`font-medium ${!exploreFollowingOnly ? 'text-green-400 font-semibold' : 'text-white'}`}>
                  All Creators
                </span>
                <button
                  onClick={() => setExploreFollowingOnly(!exploreFollowingOnly)}
                  className="w-12 h-6 bg-gray-600 rounded-full relative transition-colors"
                >
                  <div 
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ease-in-out
                      ${exploreFollowingOnly ? 'translate-x-7 left-0' : 'translate-x-1'}`}
                  />
                </button>
                <span className={`font-medium ${exploreFollowingOnly ? 'text-green-400 font-semibold' : 'text-white'}`}>
                  Following
                </span>
              </div>
              <div className="flex items-center text-sm space-x-4">
                <span className={`font-medium ${!exploreMostRecent ? 'text-green-400 font-semibold' : 'text-white'}`}>
                  Most Liked
                </span>
                <button
                  onClick={() => setExploreMostRecent(!exploreMostRecent)}
                  className="w-12 h-6 bg-gray-600 rounded-full relative transition-colors"
                >
                  <div 
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ease-in-out
                      ${exploreMostRecent ? 'translate-x-7 left-0' : 'translate-x-1'}`}
                  />
                </button>
                <span className={`font-medium ${exploreMostRecent ? 'text-green-400 font-semibold' : 'text-white'}`}>
                  Most Recent
                </span>
              </div>
            </div>
          </section>
          <div className="flex">
            {/* Left recommendations - 25% */}
            <div className="w-1/4 sticky top-0 h-screen overflow-y-auto px-4">
                <h2 className="text-xl text-center font-bold text-white mb-4">Recommended by Creators You Follow</h2>
                <RecommendationComponent type="following" />
            </div>

            {/* Center social feed - 50% */}
            <div className="w-1/2 px-8">
              <SocialFeed />
            </div>

            {/* Right recommendations - 25% */}
            <div className="w-1/4 sticky top-0 h-screen overflow-y-auto px-4">
                <h2 className="text-xl text-center font-bold text-white mb-4">Recommended by Mutual Fans</h2>
                <RecommendationComponent type="mutual" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}