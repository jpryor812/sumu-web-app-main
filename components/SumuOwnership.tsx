import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react'; // Import the arrow icon

// Total number of SUMU tokens/shares
const TOTAL_SUMU_SUPPLY = 10_000_000;

// Predefined company valuations
const VALUATIONS = [
  { label: '$0', value: 0 },
  { label: '$1M', value: 1_000_000 },
  { label: '$10M', value: 10_000_000 },
  { label: '$100M', value: 100_000_000 },
  { label: 'Patreon ($1.5B)', value: 1_500_000_000 }
];

interface SumuOwnershipProps {
  userSumuBalance: number;
  lastMonthBalance?: number; // New prop for last month's balance
  lastMonthPercentage?: number; // New prop for last month's percentage
}

export default function SumuOwnership({ 
  userSumuBalance, 
  lastMonthBalance = userSumuBalance * 0.9, // Default to 10% less if not provided
  lastMonthPercentage
}: SumuOwnershipProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const selectedValuation = VALUATIONS[sliderValue];
  
  // Calculate the user's SUMU value based on the selected valuation
  const calculateSumuValue = () => {
    const sumuPrice = selectedValuation.value / TOTAL_SUMU_SUPPLY;
    return userSumuBalance * sumuPrice;
  };
  
  const sumuValue = calculateSumuValue();
  
  // Calculate the percentage of total supply
  const percentageOfSupply = (userSumuBalance / TOTAL_SUMU_SUPPLY) * 100;
  
  // Calculate increases
  const balanceIncrease = userSumuBalance - lastMonthBalance;
  const balanceIncreasePercentage = (balanceIncrease / lastMonthBalance) * 100;
  
  // Calculate percentage increase (if lastMonthPercentage is provided)
  const percentageIncrease = lastMonthPercentage 
    ? percentageOfSupply - lastMonthPercentage
    : (balanceIncrease / TOTAL_SUMU_SUPPLY) * 100;
  
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your $SUMU Ownership</h2>
      
      {/* SUMU Balance Display */}
      <div className="bg-gray-700 rounded-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-400 text-lg font-semibold">Your $SUMU Balance</p>
          <div className="flex flex-row items-end">
            <div className="flex flex-row items-center">
              <span className="text-2xl text-white font-bold">{userSumuBalance.toLocaleString()}</span>
              <span className="ml-2 text-md text-gray-400">$SUMU</span>
            </div>
            {balanceIncrease > 0 && (
              <div className="flex items-center text-green-400 text-sm mt-1">
                <ArrowUpRight size={14} className="mr-1" />
                <span>+{balanceIncrease.toLocaleString()} (+{balanceIncreasePercentage.toFixed(1)}%) MoM</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-lg font-semibold">Ownership</p>
          <div className="flex flex-row items-end">
            <p className="text-lg font-semibold">{percentageOfSupply.toFixed(4)}%</p>
            {percentageIncrease > 0 && (
              <div className="flex items-center text-green-400 text-sm mt-1">
                <ArrowUpRight size={14} className="mr-1" />
                <span>+{percentageIncrease.toFixed(4)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Valuation Selector */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400 text-xl font-semibold">Company Valuation</p>
          <p className="text-xl font-semibold text-green-400">{selectedValuation.label}</p>
        </div>
        
        <div className="relative mb-8">
          {/* Track Line */}
          <div className="h-3 bg-gray-700 rounded-full">
            {/* Filled portion */}
            <div 
              className="h-3 bg-green-500 rounded-full"
              style={{ width: `${(sliderValue / (VALUATIONS.length -.74 )) * 100}%` }}
            ></div>
          </div>
          
          {/* Tick Circles */}
          <div className="absolute -top-1 left-0 right-0 flex justify-between">
            {VALUATIONS.map((valuation, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  onClick={() => setSliderValue(index)}
                  className={`w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center transition-all ${
                    index <= sliderValue ? 'bg-green-500' : 'bg-gray-800'
                  }`}
                >
                  {index === sliderValue && (
                    <div className="absolute">
                      <div className="relative w-12 h-12">
                        <Image
                          src="/sumu-vert-square.png"
                          alt="SUMU Coin"
                          fill
                          className="object-contain rounded-full drop-shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </button>
                <span 
                  className={`text-md font-semibold mt-3 ${
                    index === sliderValue ? 'text-green-400 font-medium' : 'text-gray-500'
                  }`}
                >
                  {valuation.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* SUMU Value Display */}
      <div className="bg-gray-700 mt-12 rounded-lg p-5">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-gray-400 text-lg font-semibold">Your $SUMU Value</p>
            <p className="text-md text-gray-500">At {selectedValuation.label} valuation</p>
          </div>
          <div className="text-right">
            <p className="text-2xl text-green-400 font-bold">${sumuValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            {selectedValuation.value > 0 && (
              <p className="text-sm text-gray-400">${(sumuValue / userSumuBalance).toFixed(2)} per $SUMU</p>
            )}
          </div>
        </div>
        
        {/* Additional context for $0 valuation */}
        {selectedValuation.value === 0 && (
          <div className="mt-3 p-3 bg-gray-600 rounded-md">
            <p className="text-sm text-gray-300">
              Sumu has a nominal valuation right now, so your $SUMU tokens have no monetary value yet. Click on different valuation points to see potential future values based on company growth.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

