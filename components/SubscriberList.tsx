'use client'

import React, { useState } from 'react';
import { MessageCircle, X, ThumbsUp, ThumbsDown, ArrowUpDown, XCircle } from 'lucide-react';
import Image from 'next/image';
import SideNav from './SideNav';

interface Subscriber {
  name: string;
  profileImage: string;
  tier: 'Basic' | 'Premium' | 'Platinum';
  joinDate: string;
  daysSubscribed: number;
  isRecommending: boolean;
  email: string;
}

const subscribers: Subscriber[] = [
  {
    name: "Ryan Cooper",
    profileImage: "/profile-800x800.png",
    tier: "Basic",
    joinDate: new Date().toISOString().split('T')[0], // Today's date
    daysSubscribed: 0,
    isRecommending: false,
    email: "ryan@example.com"
  },
  {
    name: "Alex Dethero",
    profileImage: "/alex-profile.png",
    tier: "Premium",
    joinDate: "2024-01-15",
    daysSubscribed: 74,
    isRecommending: true,
    email: "alex@example.com"
  },
  {
    name: "Sarah Chen",
    profileImage: "/photo-1.jpeg",
    tier: "Platinum",
    joinDate: "2023-12-01",
    daysSubscribed: 119,
    isRecommending: false,
    email: "sarah@example.com"
  },
  {
    name: "Justin Pryor",
    profileImage: "/profile_picture.jpg",
    tier: "Platinum",
    joinDate: "2023-11-15",
    daysSubscribed: 135,
    isRecommending: true,
    email: "justin@example.com"
  },
  {
    name: "Maria Rodriguez",
    profileImage: "/photo-2.jpeg",
    tier: "Basic",
    joinDate: "2024-02-28",
    daysSubscribed: 30,
    isRecommending: false,
    email: "maria@example.com"
  },
  {
    name: "David Kim",
    profileImage: "/photo-3.jpeg",
    tier: "Premium",
    joinDate: "2024-01-05",
    daysSubscribed: 84,
    isRecommending: true,
    email: "david@example.com"
  },
  {
    name: "Emma Wilson",
    profileImage: "/photo-4.jpeg",
    tier: "Basic",
    joinDate: "2024-03-10",
    daysSubscribed: 19,
    isRecommending: true,
    email: "emma@example.com"
  },
  {
    name: "Michael Chang",
    profileImage: "/photo-5.jpg",
    tier: "Premium",
    joinDate: "2023-12-15",
    daysSubscribed: 105,
    isRecommending: false,
    email: "michael@example.com"
  },
  {
    name: "Sophia Patel",
    profileImage: "/photo-6.jpg",
    tier: "Platinum",
    joinDate: "2023-10-01",
    daysSubscribed: 180,
    isRecommending: true,
    email: "sophia@example.com"
  },
  {
    name: "James Anderson",
    profileImage: "/photo-7.jpg",
    tier: "Basic",
    joinDate: "2024-03-01",
    daysSubscribed: 28,
    isRecommending: false,
    email: "james@example.com"
  },
  {
    name: "Olivia Martinez",
    profileImage: "/photo-8.jpg",
    tier: "Premium",
    joinDate: "2024-02-01",
    daysSubscribed: 56,
    isRecommending: true,
    email: "olivia@example.com"
  },
  {
    name: "Lucas Brown",
    profileImage: "/profile2-500x500.png",
    tier: "Basic",
    joinDate: "2024-03-15",
    daysSubscribed: 14,
    isRecommending: false,
    email: "lucas@example.com"
  },
  {
    name: "Isabella Lee",
    profileImage: "/mcStickies-1.png",
    tier: "Platinum",
    joinDate: "2023-11-01",
    daysSubscribed: 149,
    isRecommending: true,
    email: "isabella@example.com"
  }
];

type SortField = 'name' | 'tier' | 'joinDate' | 'daysSubscribed' | 'isRecommending' | 'email';
type SortDirection = 'asc' | 'desc';

interface MessageBoxProps {
  subscriber: Subscriber;
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'subscriber';
  timestamp: Date;
}

const getTierColor = (tier: string) => {
  switch(tier) {
    case 'Basic': return 'bg-gray-600';
    case 'Premium': return 'bg-purple-600';
    case 'Platinum': return 'bg-green-600';
    default: return 'bg-gray-600';
  }
};

const MessageBox: React.FC<MessageBoxProps> = ({ subscriber, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! I really enjoyed your latest post about blockchain development!",
      sender: 'subscriber',
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      id: 2,
      text: "Thanks! I'm glad you found it helpful. Let me know if you have any questions!",
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 4) // 4 minutes ago
    },
    {
      id: 3,
      text: "Actually, I was wondering if you could explain more about smart contracts?",
      sender: 'subscriber',
      timestamp: new Date(Date.now() - 1000 * 60 * 1) // 1 minute ago
    }
  ]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      }]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-[500px] max-h-[600px] flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={subscriber.profileImage}
              alt={subscriber.name}
              width={40}
              height={40}
              className="rounded-full object-cover aspect-square"
            />
            <div>
              <h3 className="text-base font-semibold text-white">{subscriber.name}</h3>
              <span className={`${getTierColor(subscriber.tier)} px-2 py-0.5 rounded-full text-[10px] font-medium`}>
                {subscriber.tier}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-green-600 rounded-l-lg rounded-tr-lg' 
                  : 'bg-gray-700 rounded-r-lg rounded-tl-lg'
              } p-3`}>
                <p className="text-sm text-white">{message.text}</p>
                <p className="text-[10px] text-gray-300 mt-1">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-800 text-sm text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your message..."
            />
            <button 
              onClick={handleSend}
              className="px-4 py-2 bg-green-600 text-sm text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SubscriberList() {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSubscribers = [...subscribers].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;

    switch (sortField) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'tier': {
        const tierOrder = { Basic: 1, Premium: 2, Platinum: 3 };
        return multiplier * (tierOrder[a.tier] - tierOrder[b.tier]);
      }
      case 'joinDate':
        return multiplier * (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime());
      case 'daysSubscribed':
        return multiplier * (a.daysSubscribed - b.daysSubscribed);
      case 'isRecommending':
        return multiplier * (Number(a.isRecommending) - Number(b.isRecommending));
      case 'email':
        return multiplier * a.email.localeCompare(b.email);
      default:
        return 0;
    }
  });

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      className="px-6 py-3 cursor-pointer group hover:bg-gray-700 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown 
          className={`h-4 w-4 transition-opacity ${
            sortField === field ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
          }`}
        />
      </div>
    </th>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex">
      <SideNav />
      
      {/* Main content area */}
      <main className="flex-1 min-h-screen ml-16 md:ml-64 overflow-y-auto">
        <div className="w-full mx-auto px-12 py-12">
          <h1 className="text-3xl font-bold mb-8">Subscriber List</h1>
          <table className="w-full text-sm font-semibold text-left text-gray-200">
            <thead className="text-xs uppercase bg-gray-800">
              <tr>
                <SortableHeader field="name">Subscriber</SortableHeader>
                <SortableHeader field="tier">Tier</SortableHeader>
                <SortableHeader field="joinDate">Join Date</SortableHeader>
                <SortableHeader field="daysSubscribed">Days Subscribed</SortableHeader>
                <SortableHeader field="isRecommending">Recommending</SortableHeader>
                <SortableHeader field="email">Email</SortableHeader>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSubscribers.map((subscriber, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-700 bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Image
                      src={subscriber.profileImage}
                      alt={subscriber.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover aspect-square"
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{subscriber.name}</span>
                      {subscriber.daysSubscribed === 0 && (
                        <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${getTierColor(subscriber.tier)} px-2.5 py-1 rounded-full text-xs font-medium`}>
                      {subscriber.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(subscriber.joinDate)}</td>
                  <td className="px-6 py-4">{subscriber.daysSubscribed} days</td>
                  <td className="px-6 py-4">
                    {subscriber.isRecommending && (
                      <ThumbsUp className="text-green-500 h-5 w-5" />
                    )}
                  </td>
                  <td className="px-6 py-4">{subscriber.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <div className="relative group">
                        <button 
                          className="text-gray-300 hover:text-white transition-colors"
                          onClick={() => setSelectedSubscriber(subscriber)}
                        >
                          <MessageCircle className="h-5 w-5" />
                          {index === 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                              1
                            </div>
                          )}
                        </button>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Chat
                        </div>
                      </div>
                      <div className="relative group">
                        <button 
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          onClick={() => console.log('Block', subscriber.name)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Block
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedSubscriber && (
          <MessageBox 
            subscriber={selectedSubscriber} 
            onClose={() => setSelectedSubscriber(null)} 
          />
        )}
      </main>
    </div>
  );
} 