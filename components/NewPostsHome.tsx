'use client'

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

type Post = {
  id: number;
  postImage: string;
  creatorName: string;
  creatorImage: string;
  title: string;
  date: string;
  category: string;
}

const POSTS_PER_PAGE = 4;

export default function NewPostsHome() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Example posts data - replace with your actual data
    const posts: Post[] = [
        {
            id: 3,
            postImage: "/digital-art-background.png",
            creatorName: "Ani-Mae",
            creatorImage: "/photo-5.jpg",
            title: "New characters coming soon...",
            date: "10:46am",
            category: "Art"
        },
        {
            id: 4,
            postImage: "/amsterdam.jpeg",
            creatorName: "Life Through Lenses",
            creatorImage: "/profile-800x800.png",
            title: "My trip in Amsterdam",
            date: "9:49am",
            category: "Art"
        },
        {
            id: 2,
            postImage: "/more-or-less-3.png",
            creatorName: "Alex Dethero",
            creatorImage: "/alex-profile.png",
            title: "NEW ALBUM OUT!",
            date: "8:56am",
            category: "Music"
        },
        {
            id: 1,
            postImage: "/Daytrade-chart.png",
            creatorName: "Just-in Trades",
            creatorImage: "/profile_picture.jpg",
            title: "How I just doubled my profit in one month",
            date: "8:46am",
            category: "Finance"
        },
        {
            id: 5,
            postImage: "/payment-blog-header.png",
            creatorName: "Blockchain Bobby",
            creatorImage: "/profile2-500x500.png",   
            title: "Here come stablecoins...",
            date: "8:12am",
            category: "Technology"
        },


    ];

    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex < posts.length - POSTS_PER_PAGE;

    const handleScroll = (direction: 'left' | 'right') => {
        if (direction === 'left' && canScrollLeft) {
            setCurrentIndex(prev => prev - 1);
        } else if (direction === 'right' && canScrollRight) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            {/* Left Arrow Container */}
            <div className="flex-none w-10">
                {canScrollLeft && (
                    <button 
                        onClick={() => handleScroll('left')}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft size={24} className="text-white" />
                    </button>
                )}
            </div>

            {/* Posts Container with Overflow */}
            <div className="flex-1 overflow-hidden">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ 
                        transform: `translateX(-${currentIndex * (100 / POSTS_PER_PAGE)}%)`,
                        width: `${(posts.length / POSTS_PER_PAGE) * 100}%`
                    }}
                >
                    {posts.map((post) => (
                        <div 
                            key={post.id} 
                            className="w-1/5 flex-shrink-0 px-3"
                        >
                            <div className="rounded-lg overflow-hidden relative">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 border-white border-2 shadow-lg rounded-lg" />
                                
                                {/* Post Image */}
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={post.postImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                
                                {/* Content - now positioned over the gradient */}
                                <div className="px-4 py-2 bg-gray-900 relative z-20">
                                    {/* Creator Info */}
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="relative w-8 h-8">
                                            <Image
                                                src={post.creatorImage}
                                                alt={post.creatorName}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                        <span className="text-white font-semibold">{post.creatorName}</span>
                                    </div>
                                    
                                    {/* Post Info */}
                                    <h3 className="text-white font-semibold text-sm truncate">
                                        {post.title}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-400 font-semibold text-xs">
                                            {post.date}
                                        </p>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Arrow Container */}
            <div className="flex-none w-10">
                {canScrollRight && (
                    <button 
                        onClick={() => handleScroll('right')}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <ChevronRight size={24} className="text-white" />
                    </button>
                )}
            </div>
        </div>
    );
}