'use client'

import { useState } from 'react';
import Image from 'next/image';
import { Search, ChevronDown, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import SideNav from '@/components/SideNav';
import { allCreators, tier1Creators, tier2Creators, tier3Creators, tier4Creators, tier5Creators, leaderboardStats } from '@/data/leaderboardData';
import RewardsInfoModal from '@/components/RewardsInfoModal';

export default function LeaderboardPage() {
  const [selectedTier, setSelectedTier] = useState<string>('151-350');
  const [sortBy, setSortBy] = useState<string>('growthPercentage');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  // Get creators based on selected tier or all creators for Top Earners
  const getCreatorsByTier = () => {
    // If Top Earners is selected, return all creators
    if (sortBy === 'projectedSUMU') {
      return allCreators;
    }
    
    // Otherwise, filter by subscriber tier
    switch(selectedTier) {
      case '1-50': return tier1Creators;
      case '51-150': return tier2Creators;
      case '151+': return tier3Creators;
      default: return tier3Creators;
    }
  };

  // Get top 5 creators for the leaderboard showcase
  const topCreators = [...getCreatorsByTier()]
    .sort((a, b) => {
      if (sortBy === 'projectedSUMU') {
        return b.projectedSUMU - a.projectedSUMU;
      }
      return b.growthPercentage - a.growthPercentage;
    })
    .slice(0, 5);

  // Filter and sort creators for the table
  const filteredCreators = getCreatorsByTier()
    .filter(creator => creator.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'growthPercentage') return b.growthPercentage - a.growthPercentage;
      if (sortBy === 'projectedUSDC') return b.projectedUSDC - a.projectedUSDC;
      if (sortBy === 'projectedSUMU') return b.projectedSUMU - a.projectedSUMU;
      if (sortBy === 'subscribersNow') return b.subscribersNow - a.subscribersNow;
      return 0;
    });

  return (
    <div className="flex">
      <SideNav />
      
      <main className="px-4 flex-1 min-h-screen ml-16 md:ml-64 overflow-y-auto">
        <div className="p-8">
          <div className="flex mb-4">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setShowRewardsModal(true);
              }}
              className="inline-flex items-center text-md font-bold text-white hover:text-blue-200 transition-colors duration-200"
            >
              First time here? Click here to learn how we calculate rewards
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold text-gray-100">Leaderboard</h1>
            <p className="text-2xl bg-gradient-to-r from-green-400 to-green-600 rounded-full px-4 py-2 font-bold text-white mb-6">Total Sumu Creators: {leaderboardStats.totalCreators}</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-11 gap-6 mb-8">
            {/* Projected Pot - takes 6 columns (half the space) */}
            <div className="col-span-3 bg-blue-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700">Projected USDC Pot:</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-4xl font-bold text-blue-500">{leaderboardStats.projectedPot.toLocaleString()} USDC</span>
                  </div>
                  <p className="text-green-600 font-semibold mt-2">+{leaderboardStats.monthlyIncrease}% MoM increase</p>
                </div>
                <div className="bg-blue-400 rounded-full p-2">
                  <p className="text-6xl">💰</p>
                </div>
              </div>
            </div>
            
            {/* Total Creators */}
            <div className="col-span-3 bg-green-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-700">Projected $SUMU Pot:</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-4xl font-bold text-green-500">5,000 $SUMU</span>
                  </div>
                </div>
                <div className="bg-green-400 rounded-full p-2 flex items-center justify-center w-20 h-20">
                  <div className="relative w-16 h-16">
                    <Image 
                      src="/sumu-vert-square.png" 
                      alt="Creator Icon" 
                      fill 
                      className="object-contain rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Time Remaining */}
            <div className="col-span-5 bg-yellow-100 rounded-xl overflow-hidden shadow-md border border-yellow-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <h3 className="text-4xl font-bold pr-2 text-gray-800">Time Remaining Until Rewards⏳</h3>
                </div>
                
                <div className="flex items-end pr-8 gap-1 md:gap-3">
                  <div className="text-center mx-2">
                    <span className="text-4xl font-bold text-gray-800">{leaderboardStats.timeRemaining.days}</span>
                    <p className="text-sm font-semibold text-gray-600">DAYS</p>
                  </div>
                  
                  <span className="text-2xl font-bold text-gray-400 pb-1">:</span>
                  
                  <div className="text-center mx-2">
                    <span className="text-4xl font-bold text-gray-800">{leaderboardStats.timeRemaining.hours}</span>
                    <p className="text-sm font-semibold text-gray-600">HOURS</p>
                  </div>
                  
                  <span className="text-2xl font-bold text-gray-400 pb-1">:</span>
                  
                  <div className="text-center mx-2">
                    <span className="text-4xl font-bold text-gray-800">{leaderboardStats.timeRemaining.minutes}</span>
                    <p className="text-sm font-semibold text-gray-600">MINUTES</p>
                  </div>
                  
                  <div className="ml-2 bg-yellow-200 rounded-full p-1 flex items-center justify-center w-20 h-20">
                    <span className="text-5xl">🏆</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Toggle for Top Growers / Top Earners */}
          <div className="mb-6 mt-4 flex justify-center">
            <div className="inline-flex rounded-xl border border-gray-300 overflow-hidden">
            <button
                className={`px-6 py-3 text-2xl font-semibold ${
                  sortBy === 'projectedSUMU' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSortBy('projectedSUMU')}
              >
                Top Earners
              </button>
              <button
                className={`px-6 py-3 text-2xl font-semibold ${
                  sortBy === 'growthPercentage' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSortBy('growthPercentage')}
              >
                Top Growers
              </button>
            </div>
          </div>
          
          {/* Subscriber Tiers - only show when Top Growers is selected */}
          {sortBy === 'growthPercentage' && (
            <div className="mb-2 flex-col justify-center">
              <h3 className="text-xl text-center font-semibold text-gray-100 mb-2">Number of Subscribers</h3>
              <div className="flex flex-row flex-wrap gap-12 justify-center">
                {['1-50', '51-150', '151+'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-8 py-4 rounded-full border min-w-[100px] text-2xl font-semibold ${
                      selectedTier === tier 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Current Leaders */}
          <h2 className="text-3xl font-bold text-gray-100 mb-6">Current Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
            {topCreators.map((creator, index) => (
              <div key={creator.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  {/* Colorful top border based on position */}
                  <div className={`h-1.5 w-full absolute top-0 left-0 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' : 
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-300' :
                    index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-500' :
                    'bg-gradient-to-r from-blue-500 to-blue-400'
                  }`}></div>
                  
                  {/* Matching bottom border */}
                  <div className={`h-1.5 w-full absolute bottom-0 left-0 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' : 
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-300' :
                    index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-500' :
                    'bg-gradient-to-r from-blue-500 to-blue-400'
                  }`}></div>
                  
                  <div className="p-4 pt-6 pb-6">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        {/* Add a colored ring around the profile image */}
                        <div className={`absolute inset-0 rounded-full ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' : 
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-300' :
                          index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-500' :
                          'bg-gradient-to-r from-blue-500 to-blue-400'
                        } p-0.5`}>
                          <div className="absolute inset-0 rounded-full bg-white p-0.5"></div>
                        </div>
                        <Image
                          src="/puja_picture.png"
                          alt={creator.name}
                          width={50}
                          height={50}
                          className="rounded-full relative z-10"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{creator.name}</h3>
                            <p className="text-2xl font-bold">
                              <span className="text-green-500">
                                +{creator.growthPercentage.toFixed(2)}%
                              </span>
                            </p>
                          </div>
                          <div>
                            {index === 0 && <span className="text-5xl drop-shadow-md">🥇</span>}
                            {index === 1 && <span className="text-5xl drop-shadow-md">🥈</span>}
                            {index === 2 && <span className="text-5xl drop-shadow-md">🥉</span>}
                            {index === 3 && (
                              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white text-xl font-bold rounded-full shadow-md">
                                4
                              </div>
                            )}
                            {index === 4 && (
                              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white text-xl font-bold rounded-full shadow-md">
                                5
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="text-center py-1 bg-gray-50 border-b border-gray-200">
                        <p className="text-gray-700 font-semibold text-md">Projected Rewards</p>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="py-2 text-center">
                          <p className="text-blue-500 font-semibold text-md">USDC</p>
                          <p className="font-bold text-blue-600 text-lg">${creator.projectedUSDC.toFixed(0)}</p>
                        </div>
                        <div className="py-2 text-center">
                          <p className="text-green-600 font-semibold text-md">$SUMU</p>
                          <p className="font-bold text-green-600 text-lg">{creator.projectedSUMU.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Global Ranking */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-100">Global Ranking</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-md font-semibold text-gray-100">Sort by</span>
                  <div className="relative">
                    <select 
                      className="appearance-none bg-white text-gray-500 border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm font-semibold"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="growthPercentage">Growth %</option>
                      <option value="projectedUSDC">USDC Rewards</option>
                      <option value="projectedSUMU">SUMU Rewards</option>
                      <option value="subscribersNow">Current Subscribers</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by user name"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm font-semibold w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">User name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Start Subs</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Current Subs</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Growth %</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">USDC Rewards</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">SUMU Rewards</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCreators.map((creator, index) => (
                    <tr 
                      key={creator.id} 
                      className={`
                        ${index === 0 ? 'bg-white hover:bg-yellow-200' : ''}
                        ${index === 1 ? 'bg-white hover:bg-gray-200' : ''}
                        ${index === 2 ? 'bg-white hover:bg-amber-200' : ''}
                        ${index === 3 || index === 4 ? 'bg-white hover:bg-blue-200' : ''}
                        ${index > 4 ? 'bg-white hover:bg-gray-50' : ''}
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {creator.trend === 'up' && <ArrowUp size={16} className="text-green-500 mr-1" />}
                          {creator.trend === 'down' && <ArrowDown size={16} className="text-red-500 mr-1" />}
                          {creator.trend === 'neutral' && <Minus size={16} className="text-gray-500 mr-1" />}
                          <span className="font-semibold text-lg text-gray-500">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image
                              src="/puja_picture.png"
                              alt={creator.name}
                              fill
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-semibold text-gray-900">{creator.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xl font-semibold text-gray-500">{creator.subscribersStart}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-500">{creator.subscribersNow}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-semibold text-green-600">+{creator.growthPercentage.toFixed(2)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-semibold text-gray-900">${creator.projectedUSDC.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-semibold text-gray-900">{creator.projectedSUMU.toFixed(0)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <RewardsInfoModal 
        isOpen={showRewardsModal} 
        onClose={() => setShowRewardsModal(false)} 
      />
    </div>
  );
}
