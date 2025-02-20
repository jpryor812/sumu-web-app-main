'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import CreatorPriceCardOne from "./CreatorPriceCardOne";
import CreatorPriceCardTwo from "./CreatorPriceCardTwo";
import SideNav from "./SideNav";
import PriceCard from './PriceCard';

export default function CreatorPage() {
    const [sidebarWidth, setSidebarWidth] = useState('16rem'); // 64px

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 768) {
            setSidebarWidth('0px');
          } else {
            setSidebarWidth('16rem');
          }
        };
    
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      const priceTiers = [
        {
          title: "Big Fan",
          price: 5,
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

  return (
    <div className="flex min-h-screen">
      <SideNav />
      
      {/* Main Content */}
      <div 
        className="flex-1 transition-all duration-300 overflow-y-auto h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="flex flex-col pb-20"> {/* Added padding bottom for content */}
        <div className="w-full h-auto">
            <Image
              src="/alex-YT-banner.png"
              alt="alex YT banner"
              height={50}
              width={2000}
            />
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 aspect-square relative">
              <Image
                src="/alex-albumcover.png"
                alt="alex Album Cover"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-full md:w-3/4">
              <div className="flex flex-col">
                <div className="text-white text-sm md:text-base font-semibold py-2 px-4 md:px-8">
                  <p>
                    Hi! My name is Alex and I make lo-fi hip hop beats. I started
                    it as a hobby in 2020, and it turned into a passion. I&apos;ve
                    made hundreds of songs, released six albums, and have even
                    performed live a few times. I would love to connect with you all
                    on a deeper level through my Suum account, and appreciate all of
                    your support!!
                  </p>
                </div>
                <div className="text-white text-xl font-semibold text-center pb-1">
                  <p>Choose Your Membership</p>
                </div>
                <div className="flex flex-row items-center justify-center gap-4">
                  <div className="text-sm text-white font-semibold">
                    <p>Monthly</p>
                  </div>
                  <div className="w-24 h-6 rounded-full bg-gray-300">
                    <div className="w-12 h-6 rounded-full bg-white"></div>
                  </div>
                  <div className="text-sm text-white font-semibold">
                    <p>Annual</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row flex-wrap py-2 px-4 md:px-24 justify-between">
                <PriceCard tiers={priceTiers} />
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
}
