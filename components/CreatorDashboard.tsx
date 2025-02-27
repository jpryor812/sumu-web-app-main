'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown } from 'lucide-react';
import SideNav from '@/components/SideNav';
import SubscriberGrowthChart from '@/components/SubscriberGrowthChart';

// Enhanced mock data with weekly and monthly timeframes only
const creatorStats = {
  name: "Emma Johnson",
  profileImage: "/puja_picture.png",
  subscribers: {
    total: 1248,
    newThisMonth: 76,
    growthPercentage: 6.5,
    // Monthly data (Jan-Apr)
    monthlyHistory: [50, 452, 981, 1248],
    monthlyLabels: ['Jan', 'Feb', 'Mar', 'Apr'],
    // Weekly data (April weeks)
    weeklyHistory: [1172, 1195, 1220, 1235, 1248],
    weeklyLabels: ['Apr 1', 'Apr 8', 'Apr 15', 'Apr 22', 'Apr 30'],
  },
  rewards: {
    totalUSDC: 1247.89,
    pendingUSDC: 247.50,
    totalSUMU: 5280,
    pendingSUMU: 680,
    ownershipPercentage: 0.0042
  },
  revenue: {
    total: 3547.65,
    thisMonth: 547.89,
    growthPercentage: 12.4
  },
  posts: {
    totalViews: 28750,
    mostViewedPost: {
      title: "How I Gained 1000 Subscribers in 30 Days",
      views: 4280
    },
    recentPost: {
      title: "My Creative Process Explained",
      views: 1876,
      date: "2 days ago"
    }
  }
};

export default function CreatorDashboard() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('monthly');
  const [activeSubscription, setActiveSubscription] = useState<'basic' | 'premium' | 'platinum'>('basic');
  
  // Get the appropriate data and labels based on the selected timeframe
  const getChartData = () => {
    switch(timeframe) {
      case 'weekly':
        return {
          data: creatorStats.subscribers.weeklyHistory,
          labels: creatorStats.subscribers.weeklyLabels
        };
      case 'monthly':
      default:
        return {
          data: creatorStats.subscribers.monthlyHistory,
          labels: creatorStats.subscribers.monthlyLabels
        };
    }
  };
  
  // Calculate growth metrics based on timeframe
  const getGrowthMetrics = () => {
    const { data } = getChartData();
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    const newSubscribers = current - previous;
    const growthPercentage = previous > 0 ? ((current - previous) / previous * 100).toFixed(1) : 0;
    
    return {
      newSubscribers,
      growthPercentage
    };
  };
  
  const { data, labels } = getChartData();
  const { newSubscribers, growthPercentage } = getGrowthMetrics();
  
  return (
    <div className="flex min-h-screen">
      {/* Side Navigation */}
      <SideNav />
      
      {/* Main Content */}
      <div className="p-6 flex-1 min-h-screen ml-16 md:ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="relative h-16 w-16 mr-4">
                <Image
                  src={creatorStats.profileImage}
                  alt={creatorStats.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{creatorStats.name}</h1>
                <p className="text-gray-400">Creator since January 2023</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white">
                Share Dashboard
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white">
                Export Data
              </button>
            </div>
          </div>
          
          {/* Main Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-300">Total Subscribers</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-4xl font-bold text-white">{creatorStats.subscribers.total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUp size={18} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-semibold">+{newSubscribers} this {timeframe === 'weekly' ? 'week' : 'month'}</span>
                  </div>
                </div>
                <div className="bg-green-500 bg-opacity-20 rounded-full p-3">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-300">USDC Rewards</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-4xl font-bold text-white">{creatorStats.rewards.totalUSDC.toLocaleString()} USDC</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-blue-400 font-semibold">{creatorStats.rewards.pendingUSDC} USDC pending</span>
                  </div>
                </div>
                <div className="bg-blue-500 bg-opacity-60 rounded-full p-3">
                  <span className="text-5xl">💰</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-300">$SUMU Rewards</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-4xl font-bold text-white">{creatorStats.rewards.totalSUMU.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-green-400 font-semibold">{creatorStats.rewards.pendingSUMU} pending</span>
                  </div>
                </div>
                <div className="bg-green-500 bg-opacity-20 rounded-full p-2">
                  <div className="relative w-14 h-14">
                    <Image 
                      src="/sumu-vert-square.png" 
                      alt="SUMU Token" 
                      fill 
                      className="object-contain w-12 h-12 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscriber Growth Chart */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Subscriber Growth</h2>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 rounded-md text-white ${timeframe === 'weekly' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setTimeframe('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-white ${timeframe === 'monthly' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  onClick={() => setTimeframe('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400">Total Fans</p>
                <p className="text-3xl font-bold text-white">{creatorStats.subscribers.total.toLocaleString()}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400">New Fans This {timeframe === 'weekly' ? 'Week' : 'Month'}</p>
                <p className="text-3xl font-bold text-white">{newSubscribers}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400">{timeframe === 'weekly' ? 'Weekly' : 'Monthly'} Growth</p>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-white">{growthPercentage}%</p>
                  <ArrowUp size={20} className="text-green-500 ml-2" />
                </div>
              </div>
            </div>
            
            {/* Pass data and labels to the chart component */}
            <SubscriberGrowthChart 
            />
          </div>
          
          {/* Second Row - Revenue and Platform Ownership */}
            {/* Revenue Section */}
            <div className="bg-gray-800 mb-6 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Revenue</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side - Revenue stats */}
                <div>
                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-gray-400">Total Revenue</p>
                    <p className="text-3xl font-bold">${creatorStats.revenue.total.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400">This Month</p>
                    <div className="flex items-center">
                      <p className="text-3xl font-bold">${creatorStats.revenue.thisMonth.toLocaleString()}</p>
                      <div className="flex items-center ml-3">
                        <span className="text-green-500 font-semibold">+{creatorStats.revenue.growthPercentage}% MoM</span>
                        <ArrowUp size={16} className="text-green-500 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Subscription tiers */}
                <div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold -mt-8 mb-2">Subscription Tiers</p>
                    <div className="flex bg-gray-700 rounded-lg p-1">
                      <button 
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                          activeSubscription === 'basic' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => setActiveSubscription('basic')}
                      >
                        Basic ($5)
                      </button>
                      <button 
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                          activeSubscription === 'premium' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => setActiveSubscription('premium')}
                      >
                        Premium ($10)
                      </button>
                      <button 
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                          activeSubscription === 'platinum' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => setActiveSubscription('platinum')}
                      >
                        Platinum ($25)
                      </button>
                    </div>
                  </div>
                  
                  {/* Subscription details */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    {activeSubscription === 'basic' && (
                      <>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Subscribers</p>
                          <p className="font-bold">142</p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Monthly Revenue</p>
                          <p className="font-bold">$710</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-400">% of Total Revenue</p>
                          <p className="font-bold">48%</p>
                        </div>
                      </>
                    )}
                    
                    {activeSubscription === 'premium' && (
                      <>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Subscribers</p>
                          <p className="font-bold">68</p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Monthly Revenue</p>
                          <p className="font-bold">$680</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-400">% of Total Revenue</p>
                          <p className="font-bold">36%</p>
                        </div>
                      </>
                    )}
                    
                    {activeSubscription === 'platinum' && (
                      <>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Subscribers</p>
                          <p className="font-bold">12</p>
                        </div>
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-400">Monthly Revenue</p>
                          <p className="font-bold">$300</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-400">% of Total Revenue</p>
                          <p className="font-bold">16%</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Platform Ownership Section - Now in the second column */}
          
          {/* Post Performance Section - Now full width at the bottom */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Post Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400">Total Views</p>
                <p className="text-3xl font-bold">{creatorStats.posts.totalViews.toLocaleString()}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-400">Most Viewed Post</p>
                    <p className="font-semibold truncate max-w-xs">{creatorStats.posts.mostViewedPost.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">Views</p>
                    <p className="font-bold">{creatorStats.posts.mostViewedPost.views.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-400">Recent Post</p>
                    <p className="font-semibold truncate max-w-xs">{creatorStats.posts.recentPost.title}</p>
                    <p className="text-sm text-gray-400">{creatorStats.posts.recentPost.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">Views</p>
                    <p className="font-bold">{creatorStats.posts.recentPost.views.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 mb-6 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Platform Ownership</h2>
              <div className="flex items-center">
                <div className="w-full bg-gray-700 rounded-full h-4 mr-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full" 
                    style={{ width: `${creatorStats.rewards.ownershipPercentage * 100}%` }}
                  ></div>
                </div>
                <span className="text-xl font-bold">{(creatorStats.rewards.ownershipPercentage * 100).toFixed(4)}%</span>
              </div>
              <p className="text-gray-400 mt-2">Your share of the Sumu platform based on your $SUMU holdings</p>
            </div>
          
          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Want to increase your rewards?</h2>
                <p className="text-white opacity-90 max-w-xl">Post more content, engage with your audience, and grow your subscriber base to earn more rewards and increase your platform ownership.</p>
              </div>
              <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                View Creator Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 