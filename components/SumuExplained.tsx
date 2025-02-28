import React, { useState } from 'react';
import Image from 'next/image';

interface SumuExplainedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SumuExplainedModal({ isOpen, onClose }: SumuExplainedModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-lg w-4/5 max-w-4xl h-[85vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-gray-50 z-10">
          <h2 className="text-2xl font-bold text-gray-800">Understanding $SUMU</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold text-xl ${
              activeTab === 'overview' 
                ? 'text-green-600 border-b-4 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold text-xl ${
              activeTab === 'details' 
                ? 'text-blue-500 border-b-4 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            How It Works
          </button>
        </div>
        
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="prose prose-lg max-w-none">
              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
                <p className="text-xl text-gray-700">
                  "For some reason, startups don't make their users owners, when in most cases, much like is the case with Sumu, our platform would be nothing without its users."
                </p>
              </div>

              <h3 className="text-3xl font-bold text-gray-800 mb-6">Your Stake in Sumu's Success</h3>
              
              <p className="text-lg text-gray-600 mb-6">
                We want to beat Patreon, and we can only do so if you make excellent content for your fans, work hard to grow, invite your creator friends, and stay with us for the long haul.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <p className="text-xl text-gray-700">
                  At a $1.5B valuation (Patreon's last valuation), there's a chance that hundreds of creators earn at least six figures worth of equity and thousands earn at least five figures.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8">
                <p className="text-xl text-gray-700">
                  Early creators who contribute meaningfully and stay for many years have a reasonable chance to accrue at least 0.02% in Sumu - potentially worth $300,000 at a $1.5B valuation.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">What is $SUMU?</h3>
              <p className="text-lg text-gray-600 mb-6">
                $SUMU is a virtual token that represents an ownership interest in Sumu, a private, for‑profit Nevada C‑Corporation. Holding $SUMU gives you a stake in our company—much like owning shares in a traditional business.
              </p>

              <h4 className="text-xl font-semibold text-gray-800 mb-4">How to Get $SUMU:</h4>
              <ul className="list-disc pl-6 text-lg text-gray-600 mb-8">
                <li>Earn monthly based on your revenue contribution</li>
                <li>Roughly 0.05% of total $SUMU distributed monthly</li>
                <li>Approximately 0.6% distribution annually</li>
                <li>Target of 6% total creator share over 10 years</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Example Scenario:</h4>
                <p className="text-lg text-gray-700">
                  If an investor purchases $1M worth of Sumu stock at a $10M post-money valuation, each $SUMU token would be worth $1. With 1,000 tokens, your stake would be worth $1,000 (0.01% of Sumu).
                </p>
              </div>

              <h4 className="text-xl font-semibold text-gray-800 mb-4">Important Notes:</h4>
              <ul className="list-disc pl-6 text-lg text-gray-600 mb-8">
                <li>Value is nominal until a liquidity event occurs</li>
                <li>Option to sell tokens back at last defined price if you leave</li>
                <li>Early creators benefit from lowest price and longest holding periods</li>
                <li>No guaranteed value - subject to startup investment risks</li>
              </ul>

              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <p className="text-xl text-gray-700 mb-4">
                  Questions about $SUMU? Contact us at justin@getsumu.xyz
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
