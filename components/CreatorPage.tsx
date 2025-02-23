'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import SideNav from "./SideNav";
import PriceCard from './PriceCard';
import LockedPost from '@/components/LockedPost';

interface Testimonial {
    text: string;
    author: string;
  }
  
export default function CreatorPage() {
    const [sidebarWidth, setSidebarWidth] = useState('16rem');
    const [isAnnual, setIsAnnual] = useState(false);
    
    // Define discount percentage
    const annualDiscount = 20;

    const testimonials: [Testimonial, Testimonial] = [
        {
          text: "I love this channel so much. Everyone should subscribe!",
          author: "Just123"
        },
        {
          text: "Alex's music is so good. I've been a fan since 2020.",
          author: "Just123"
        }
      ];

    // Calculate annual price (monthly price * 12 months * (1 - discount))
    const calculateAnnualPrice = (monthlyPrice: number): number => {
      return Math.round(monthlyPrice * 12 * (1 - annualDiscount / 100));
  };

    const priceTiers = [
        {
          title: "Big Fan",
          price: 5,
          annualPrice: 51, // 5 * 12 * 0.85 rounded
          description: "Get early access to all my songs and videos before they're released",
          features: [
            "Early access to all songs",
            "Behind the scenes content",
            "Monthly livestreams",
            "Exclusive community access"
          ],
        },
        {
          title: "Super Fan",
          price: 15,
          annualPrice: 153, // 15 * 12 * 0.85 rounded
          description: "Everything in Early Access plus exclusive content and personalized perks",
          features: [
            "All Early Access benefits",
            "Custom song requests",
            "Private Discord channel",
            "Monthly virtual meetups"
          ],
          isPopular: true
        }
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarWidth('0px');
            } else {
                setSidebarWidth('16rem');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen">
            <SideNav />
            
            <div className="flex-1 transition-all duration-300 overflow-y-auto h-screen"
                style={{ marginLeft: sidebarWidth }}>
                <div className="flex flex-col pb-20">
                    <div className="w-full h-auto">
                        <Image
                            src="/alex-YT-banner.png"
                            alt="alex YT banner"
                            height={50}
                            width={2000}
                        />
                    </div>
                        <div className="flex justify-center items-center -mt-16 px-8 w-full">
                        <Image
                        src="/loom-placeholder.png"
                        alt="loom placeholder"
                        height={150}
                        width={150}
                        />
                    </div>
                    <div className="flex w-full justify-center flex-col md:flex-row">
                            <div className="flex flex-col">
                            <div className="text-white text-lg md:text-2xl text-center font-semibold py-2">
                                <p>
                                        Alex Dethero
                                    </p>
                                </div>
                                <div className="text-white text-sm md:text-base font-semibold py-2 px-4 md:px-24 lg:px-48">
                                <p>
                                        Hi! My name is Alex and I make lo-fi hip hop beats. I started
                                        it as a hobby in 2020, and it turned into a passion. I&apos;ve
                                        made hundreds of songs, released six albums, and have even
                                        performed live a few times. I would love to connect with you all
                                        on a deeper level through my Sumu account, and appreciate all of
                                        your support!
                                    </p>
                                </div>
                                
                                <div className="text-white text-xl font-semibold text-center pb-1">
                                    <p>Choose Your Membership</p>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-2 py-4">
                                <div className="flex items-center justify-center gap-4">
                                    <span className={`text-sm font-semibold ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
                                        Monthly
                                    </span>
                                    <button
                                        onClick={() => setIsAnnual(!isAnnual)}
                                        className="relative w-24 h-6 rounded-full bg-gray-700 focus:outline-none"
                                    >
                                        <div
                                            className={`absolute top-0 w-12 h-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                                                isAnnual ? 'translate-x-full' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
                                            Annual
                                        </span>
                                        <span className="text-sm text-gray-300 font-medium">
                                            (Save 20%)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between w-full px-8">
  {/* Left testimonial */}
  <div className="w-72 px-4 flex flex-col">
    <div className="flex flex-col items-center w-full">
      <Image
        src="/profile_picture.jpg"
        alt="LucyLooWho"
        width={36}
        height={36}
        className="rounded-full mb-2"
      />
      <span className="text-white text-center font-semibold mb-2">LucyLooWho</span>
    </div>
    <p className="text-white text-center text-sm italic">
      "I love this channel so much! Alex's music is so good. I listen to it basically daily, and the live sessions of him making music are so cool to see"
    </p>
  </div>

  {/* Price cards container */}
  <div className="flex flex-col md:flex-row gap-6 mx-4">
    <PriceCard tiers={priceTiers} isAnnual={isAnnual} />
  </div>

  {/* Right testimonial */}
  <div className="w-72 px-4 flex flex-col">
    <div className="flex flex-col items-center w-full">
      <Image
        src="/puja_picture.png"
        alt="LucyLooWho"
        width={36}
        height={36}
        className="rounded-full mb-2"
      />
      <span className="text-white text-center font-semibold mb-2">Pujaaaa</span>
    </div>
    <p className="text-white text-center text-sm italic">
      "I love this channel so much! Alex's music is so good. I listen to it basically daily, and the live sessions of him making music are so cool to see"
    </p>
  </div>
</div>
                                <div className="flex justify-center w-full pt-4">
                                    <div className="flex items-center justify-between bg-[#4040FF] rounded-full p-1 w-80">
                                        <span className="text-white font-semibold px-4 py-2">Share with a friend</span>
                                        <button className="bg-white text-black px-8 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                                            Share
                                        </button>
                                    </div>
                                </div>
                                <div className="py-8">
                                    <LockedPost
                                    title="That Time France Went 'All Nuclear'"
                                    subtitle="The story of how France almost went all nuclear. This 25-minute story is a must-listen for any history buff."
                                    date="February 16"
                                    image="/asianometry.png"
                                    comments={[
                                        {
                                          username: "energyExpert",
                                          text: "Really interesting perspective on France's nuclear program!",
                                          timestamp: "2h ago"
                                        },
                                        {
                                          username: "greenTech",
                                          text: "Great analysis of their transition strategy.",
                                          timestamp: "1h ago"
                                        },
                                        {
                                          username: "historyBuff",
                                          text: "The political context during this period is fascinating.",
                                          timestamp: "30m ago"
                                        }
                                      ]}
                                    isSubscribed={false}
                                    />
                                </div>
                                <div className="py-8">
                                    <LockedPost
                                    title="That Time France Went 'All Nuclear'"
                                    subtitle="The story of how France almost went all nuclear. This 25-minute story is a must-listen for any history buff."
                                    date="February 16"
                                    image="/asianometry.png"
                                    comments={[
                                        {
                                          username: "energyExpert",
                                          text: "Really interesting perspective on France's nuclear program!",
                                          timestamp: "2h ago"
                                        },
                                        {
                                          username: "greenTech",
                                          text: "Great analysis of their transition strategy.",
                                          timestamp: "1h ago"
                                        },
                                        {
                                          username: "historyBuff",
                                          text: "The political context during this period is fascinating.",
                                          timestamp: "30m ago"
                                        }
                                      ]}
                                    isSubscribed={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}