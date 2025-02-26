import React, { useState } from 'react';

interface RewardsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardsInfoModal({ isOpen, onClose }: RewardsInfoModalProps) {
  const [activeTab, setActiveTab] = useState('timeline');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-lg w-4/5 max-w-4xl h-3/4 overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">How We Calculate Rewards</h2>
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
              activeTab === 'sumu' 
                ? 'text-green-600 border-b-4 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('sumu')}
          >
            How We Reward $SUMU
          </button>
          
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold text-xl ${
              activeTab === 'usdc' 
                ? 'text-blue-500 border-b-4 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('usdc')}
          >
            How We Reward USDC
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-8">
          
          {/* How We Reward $SUMU Content */}
          {activeTab === 'sumu' && (
            <div className="mb-6">
              <h3 className="text-4xl font-semibold text-gray-700 mb-4">How We Reward $SUMU</h3>
              <p className="text-gray-600 mb-4 text-2xl font-semibold pl-8">Or said another way, how we make you an owner in Sumu 😊</p>
            </div>
          )}
          
          {/* How We Reward USDC Content */}
          {activeTab === 'usdc' && (
            <div className="mb-6">
            <h3 className="text-4xl font-semibold text-gray-700 mb-4">How We Reward USDC</h3>
            <p className="text-gray-600 mb-4 text-2xl font-semibold pl-8">Brace Yourself, Algebra Ahead 👩‍🏫</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 