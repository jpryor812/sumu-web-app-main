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
}

const POSTS_PER_PAGE = 4;

export default function NewPostsHome() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Example posts data - replace with your actual data
    const posts: Post[] = [
        {
            id: 1,
            postImage: "/payment-blog-header.png",
            creatorName: "Just-in Trades",
            creatorImage: "/profile_picture.jpg",
            title: "Why You Should Use USDC",
            date: "8:46am"
        },
        {
            id: 2,
            postImage: "/payment-blog-header.png",
            creatorName: "Just-in Trades",
            creatorImage: "/profile_picture.jpg",
            title: "Why You Should Use USDC",
            date: "8:56am"
        },
        {
            id: 3,
            postImage: "/payment-blog-header.png",
            creatorName: "Just-in Trades",
            creatorImage: "/profile_picture.jpg",   
            title: "Why You Should Use USDC",
            date: "9:46am"
        },
        {
            id: 4,
            postImage: "/payment-blog-header.png",
            creatorName: "Just-in Trades",
            creatorImage: "/profile_picture.jpg",
            title: "Why You Should Use USDC",
            date: "9:49am"
        },
        {
            id: 5,
            postImage: "/payment-blog-header.png",
            creatorName: "Tony",
            creatorImage: "/profile_picture.jpg",
            title: "Why You Should Use USDC",
            date: "10:46am"
        }
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
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/70 to-green-950/90 z-10" />
                                
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
                                <div className="p-4 relative z-20">
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
                                    <h3 className="text-white font-semibold">{post.title}</h3>
                                    <p className="text-gray-500 font-semibold text-sm">{post.date}</p>
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