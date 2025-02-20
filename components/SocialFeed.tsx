'use client'

import Image from "next/image";
import { MessageCircle, HeartIcon, Repeat2 } from "lucide-react";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function SocialFeed() {
  const controls = useAnimationControls();
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const componentRef = useRef(null);
  
  const categories = [
    { name: "All", active: true },
    { name: "Art", active: false },
    { name: "Fashion", active: false },
    { name: "Finance", active: false },
    { name: "Gaming", active: false },
    { name: "Music", active: false },
    { name: "Tech", active: false },
    { name: "World Affairs", active: false },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.3
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, [isInView]);

  // Animation sequence
  useEffect(() => {
    const startAnimation = async () => {
      if (hasAnimated) return; // Don't animate if we've already done it
      
      setHasAnimated(true);
      
      // Function to run one complete animation cycle
      const runAnimationCycle = async () => {
        // Start at top
        await controls.start({ y: 0 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Scroll to second post
        await controls.start({ 
          y: "-33.33%", 
          transition: { duration: 1.5, ease: "easeInOut" }
        });
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Scroll to third post
        await controls.start({ 
          y: "-60.00%", 
          transition: { duration: 1.5, ease: "easeInOut" }
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Scroll back to top
        await controls.start({ 
          y: 0, 
          transition: { duration: 2, ease: "easeInOut" }
        });
        await new Promise(resolve => setTimeout(resolve, 500)); // Add pause between cycles
      };
  
      // Run the animation cycle twice
      await runAnimationCycle();
      await runAnimationCycle();
    };
  
    // Only start animation when component is in view
    if (isInView) {
      startAnimation();
    }
  }, [controls, isInView, hasAnimated]);

  return (
    <div ref={componentRef} className="bg-black border-white border-2 rounded-lg w-full max-w-4xl mx-auto overflow-hidden">
      {/* Categories Section */}
      <div className="w-full overflow-x-auto">
        <div className="flex flex-row gap-6 p-4 justify-start md:justify-center min-w-max">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`text-sm text-gray-300 whitespace-nowrap ${
                category.active ? "font-semibold border-b-2 border-pink-500" : "hover:text-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Container with Animation */}
      <div className="h-[500px] overflow-hidden"> {/* Fixed height container */}
        <motion.div
          animate={controls}
          initial={{ y: 0 }}
        >
          {/* First Post */}
          <div className="px-4 md:px-8 pb-6">
            <div className="bg-[#001405] border-gray-500 border-2 rounded-2xl w-full">
              <div className="flex items-center gap-3 p-4">
                <Image
                  src="/alex-profile.png"
                  alt="alex Album Cover"
                  height={32}
                  width={32}
                  className="rounded-full"
                />
                <div className="flex items-center gap-2 flex-grow">
                  <span className="text-sm font-semibold text-gray-200">
                    Alex Dethero
                  </span>
                  <span className="text-xs text-gray-500">6:45pm</span>
                </div>
              </div>

              <div className="px-4 pb-2">
                <p className="sm:text-md text-sm font-semibold text-gray-200">
                  Listened to some classic jazz at work today and I&apos;m feeling creative.
                  Surprise live music making session tonight at 8:00pm est. for all of
                  my fans! Looking forward to chatting with you all and making some
                  hits!!
                </p>
              </div>

              <div className="px-6 py-2">
                <div className="relative w-full aspect-[3/1]">
                  <Image
                    src="/alex-tweet-image.png"
                    alt="alex post image"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-12 md:gap-24 p-4">
                <button className="text-sm sm:text-md flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <MessageCircle size={20} />
                  <span>9</span>
                </button>
                <button className="text-sm sm:text-md flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <Repeat2 size={20} />
                  <span>5</span>
                </button>
                <button className="text-sm sm:text-md flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <HeartIcon size={20} />
                  <span>22</span>
                </button>
              </div>
            </div>
          </div>

          {/* Second Post */}
          <div className="px-4 md:px-8 pb-6">
            <div className="bg-[#001405] border-gray-500 border-2 rounded-2xl w-full">
              {/* ... Same content as first post ... */}
              <div className="flex items-center gap-3 p-4">
                <Image
                  src="/profile_picture.jpg"
                  alt="Justin profile picture"
                  height={32}
                  width={32}
                  className="rounded-full"
                />
                <div className="flex items-center gap-2 flex-grow">
                  <span className="text-sm font-semibold text-gray-200">
                    Justin Pryor
                  </span>
                  <span className="text-xs text-gray-500">6:25pm</span>
                </div>
              </div>

              <div className="px-4 pb-2">
                <p className="text-md font-semibold text-gray-200">
                  Seeing some really interesting after hours trades in Acme. Corp... 
                  Looking forward to an exciting and profitable trading session with you all bright and early tomorrow!
                </p>
              </div>

              <div className="px-6 py-2">
                <div className="relative w-full aspect-[3/1]">
                  <Image
                    src="/Daytrade-chart.png"
                    alt="Daytrade chart image"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-12 md:gap-24 p-4">
                <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <MessageCircle size={20} />
                  <span>7</span>
                </button>
                <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <Repeat2 size={20} />
                  <span>4</span>
                </button>
                <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <HeartIcon size={20} />
                  <span>19</span>
                </button>
              </div>
            </div>
          </div>

          {/* Third Post */}
          <div className="px-4 md:px-8 pb-6">
            <div className="bg-[#001405] border-gray-500 border-2 rounded-2xl w-full">
              <div className="flex items-center gap-3 p-4">
                <Image
                  src="/profile-800x800.png"
                  alt="Photographer girl"
                  height={32}
                  width={32}
                  className="rounded-full"
                />
                <div className="flex items-center gap-2 flex-grow">
                  <span className="text-sm font-semibold text-gray-200">
                    Life Though Lenses
                  </span>
                  <span className="text-xs text-gray-500">6:10pm</span>
                </div>
              </div>

              <div className="px-4 pb-2">
                <p className="text-md font-semibold text-gray-200">
                  I had a magical day through Amsterdam today. Took some beautiful pictures that
                  I can&apos;t wait to mint and raffle off to you all next week! Here&apos;s a sneak peek of one of my favorites.   
                </p>
              </div>

              <div className="px-6 py-2">
                <div className="relative w-full aspect-[3/1]">
                  <Image
                    src="/amsterdam.jpeg"
                    alt="amsterdam"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-12 md:gap-24 p-4">
                <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <MessageCircle size={20} />
                  <span>15</span>
                </button>
                <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <Repeat2 size={20} />
                  <span>8</span>
                </button>
                <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
                  <HeartIcon size={20} />
                  <span>34</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}