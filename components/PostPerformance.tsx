import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const creatorStats = {
    posts: {
        totalViews: 2750,
        topPosts: [
      {
        title: "How I Gained 1000 Subscribers in 30 Days",
        views: 480,
        date: "2 weeks ago",
        excerpt: "In this post, I share the exact strategy I used to grow my audience rapidly...",
        likes: 42,
        comments: 8,
        image: "/asianometry.png"
      },
      {
        title: "5 Ways to Monetize Your Content Without Ads",
        views: 365,
        date: "3 weeks ago",
        excerpt: "Tired of relying on ad revenue? Here are 5 alternative monetization strategies...",
        likes: 38,
        comments: 17,
        image: "/asianometry.png"
      },
      {
        title: "The Ultimate Guide to Content Creation Tools",
        views: 289,
        date: "1 month ago",
        excerpt: "These are the essential tools every content creator needs in their arsenal...",
        likes: 26,
        comments: 9,
        image: "/asianometry.png"
      },
      {
        title: "Content Strategy: Quality vs. Quantity",
        views: 245,
        date: "5 weeks ago",
        excerpt: "The age-old debate: should you focus on quality or quantity? Here's my take...",
        likes: 19,
        comments: 7,
        image: "/asianometry.png"
      }
    ],
    recentPosts: [
      {
        title: "My Creative Process Explained",
        views: 187,
        date: "2 days ago",
        excerpt: "A behind-the-scenes look at how I create content from idea to publication...",
        likes: 24,
        comments: 12,
        image: "/asianometry.png"
      },
      {
        title: "Q&A: Answering Your Most Asked Questions",
        views: 224,
        date: "5 days ago",
        excerpt: "Join me for a live Q&A session where I answer all your burning questions...",
        likes: 32,
        comments: 8,
        image: "/asianometry.png"
      },
      {
        title: "The Importance of Consistency in Content Creation",
        views: 260,
        date: "1 week ago",
        excerpt: "Discover the power of consistency in content creation and how it can help you grow...",
        likes: 24,
        comments: 6,
        image: "/asianometry.png"
      },
      {
        title: "Behind the Scenes: My Content Production Setup",
        views: 198,
        date: "10 days ago",
        excerpt: "Take a tour of my home studio and see the equipment I use to create content...",
        likes: 18,
        comments: 5,
        image: "/asianometry.png"
      }
    ],
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

export default function PostPerformance() {
    const [postView, setPostView] = useState<'mostViewed' | 'mostRecent'>('mostViewed');
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    
    // Reset currentPostIndex when switching between Most Viewed and Most Recent
    useEffect(() => {
        setCurrentPostIndex(0);
    }, [postView]);
    
    const posts = postView === 'mostViewed' 
      ? creatorStats.posts.topPosts 
      : creatorStats.posts.recentPosts;
    
    const canScrollLeft = currentPostIndex > 0;
    const canScrollRight = currentPostIndex < posts.length - 3;
    
    const handlePostScroll = (direction: 'left' | 'right') => {
      if (direction === 'left' && canScrollLeft) {
        setCurrentPostIndex(prev => prev - 1);
      } else if (direction === 'right' && canScrollRight) {
        setCurrentPostIndex(prev => prev + 1);
      }
    };

    return (
      <div className="bg-gray-800 mb-6 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-3 items-center mb-6">
          {/* Left: Post Performance Title */}
          <div className="justify-self-start">
            <h2 className="text-2xl font-bold">Post Performance</h2>
          </div>
          
          {/* Center: Toggle between Most Viewed and Most Recent */}
          <div className="justify-self-center">
            <div className="bg-gray-700 rounded-lg p-1 flex">
              <button 
                className={`py-2 px-4 rounded-md text-md font-semibold transition-colors ${
                  postView === 'mostViewed' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setPostView('mostViewed')}
              >
                Most Viewed
              </button>
              <button 
                className={`py-2 px-4 rounded-md text-md font-semibold transition-colors ${
                  postView === 'mostRecent' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setPostView('mostRecent')}
              >
                Most Recent
              </button>
            </div>
          </div>
          
          {/* Right: Total Views Counter */}
          <div className="justify-self-end text-right">
            <p className="text-gray-400">Total Views</p>
            <p className="text-2xl font-bold">{creatorStats.posts.totalViews.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Post Grid with Navigation */}
        <div className="relative">
          <div className="flex items-center space-x-4">
            {/* Left Arrow */}
            <div className="flex-none w-10">
              {canScrollLeft && (
                <button 
                  onClick={() => handlePostScroll('left')}
                  className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft size={24} className="text-gray-300" />
                </button>
              )}
            </div>
            
            {/* Posts Container with Overflow */}
            <div className="flex-1 overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentPostIndex * (100 / 3)}%)`,
                  width: `${(posts.length / 3) * 100}%`
                }}
              >
                {posts.map((post, index) => (
                  <div key={index} className="w-1/4 flex-shrink-0 px-2">
                    <div className="bg-gray-700 rounded-lg p-4 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg truncate pr-2">{post.title}</h3>
                        <div className="flex items-center bg-gray-600 px-2 py-1 rounded">
                          <span className="text-sm font-medium">{post.views.toLocaleString()}</span>
                          <span className="ml-1 text-sm text-gray-400">views</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-md mb-3 line-clamp-2">{post.excerpt}</p>
                      
                      {/* Post Image */}
                      <div className="relative h-36 w-full mb-3 rounded-md overflow-hidden">
                        <Image
                          src={post.image || "/placeholder-image.jpg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-sm text-gray-400">{post.date}</span>
                        <div className="flex items-center text-sm">
                          <span className="text-blue-400 mr-3">
                            <span className="mr-1">👍</span> {post.likes}
                          </span>
                          <span className="text-purple-400">
                            <span className="mr-1">💬</span> {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Arrow */}
            <div className="flex-none w-10">
              {canScrollRight && (
                <button 
                  onClick={() => handlePostScroll('right')}
                  className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <ChevronRight size={24} className="text-gray-300" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}