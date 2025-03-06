'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Play } from 'lucide-react';
import SideNav from "@/components/SideNav";
import StaticAura from "@/components/StaticAura";
import { 
  SiX, 
  SiInstagram, 
  SiYoutube, 
  SiTiktok, 
  SiFacebook, 
  SiTwitch,
  SiGithub,
  SiDiscord,
} from '@icons-pack/react-simple-icons';
import LockedPost from '@/components/LockedPost';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SocialLink {
  platform: string;
  url: string;
}

interface Creator {
  display_name: string;
  bio: string;
  banner_image_url: string;
  profile_media_url: string;
  profile_media_type: 'image' | 'video';
  social_links: SocialLink[];
  membership_tiers: {
    name: string;
    price: string;
    description: string;
    features: string[];
  }[];
}

export default function MyPage() {
  const [sidebarWidth, setSidebarWidth] = useState('16rem');
  const [isAnnual, setIsAnnual] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const fetchCreator = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching creator:', error);
        return;
      }
      
      setCreator(data);
    };
    
    fetchCreator();
  }, [user]);

  const getPlatformIcon = (platform: string) => {
    const iconProps = { size: 24, className: "text-gray-300 hover:text-white transition-colors" };
    
    switch (platform.toLowerCase()) {
      case 'x': return <SiX {...iconProps} />;
      case 'instagram': return <SiInstagram {...iconProps} />;
      case 'youtube': return <SiYoutube {...iconProps} />;
      case 'tiktok': return <SiTiktok {...iconProps} />;
      case 'facebook': return <SiFacebook {...iconProps} />;
      case 'twitch': return <SiTwitch {...iconProps} />;
      case 'github': return <SiGithub {...iconProps} />;
      case 'discord': return <SiDiscord {...iconProps} />;
      default: return null;
    }
  };

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

  if (!creator) return null;

  return (
    <StaticAura>
      <div className="flex z-10 min-h-screen">
        <SideNav />
        
        <div className="flex-1 transition-all duration-300 overflow-y-auto h-screen"
          style={{ marginLeft: sidebarWidth }}>
          <div className="flex flex-col pb-20">
            {/* Banner Image */}
            <div className="w-full h-[250px] relative bg-gray-800">
              {creator.banner_image_url && (
                <Image
                  src={creator.banner_image_url}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Profile Media */}
            <div className="flex justify-center -mt-16 px-8">
              <div className="relative w-36 h-36 rounded-full border-4 border-gray-900 bg-gray-800">
                {creator.profile_media_url && (
                  creator.profile_media_type === 'video' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={creator.profile_media_url}
                        className="w-full h-full rounded-full object-cover"
                        style={{ transform: 'rotate(180deg)' }}
                        playsInline
                        ref={(videoEl) => {
                          if (videoEl) {
                            if (isPlaying) {
                              videoEl.play();
                              videoEl.style.transform = 'rotate(180deg)';
                            } else {
                              videoEl.pause();
                            }
                          }
                        }}
                        onEnded={() => setIsPlaying(false)}
                      />
                      {!isPlaying && (
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-20 rounded-full"
                          style={{ transform: 'rotate(180deg)' }}
                        >
                          <Play className="w-12 h-12 text-white" style={{ transform: 'rotate(180deg)' }} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <Image
                      src={creator.profile_media_url}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col items-center px-8 py-4">
              <h2 className="text-white text-lg md:text-2xl lg:text-3xl text-center font-semibold pb-2">
                {creator.display_name}
              </h2>
              <div className="text-gray-300 text-center text-sm md:text-base italic font-semibold pb-4 px-8 md:px-24 lg:px-36">
                <p>
                  {creator.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mb-8">
                {creator.social_links
                  .filter(link => link.platform && link.url)
                  .map((link, index) => {
                    const icon = getPlatformIcon(link.platform);
                    if (!icon) return null;
                    
                    return (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform"
                      >
                        {icon}
                      </a>
                    );
                  })}
              </div>

              {/* Membership Tiers */}
              <h3 className="text-xl font-semibold text-white mb-6">
                Choose Your Membership
              </h3>

              {/* Annual/Monthly Toggle */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <span className={`text-md font-semibold ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="relative w-24 h-6 rounded-full bg-gray-700 mx-4"
                >
                  <div
                    className={`absolute top-0 w-12 h-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                      isAnnual ? 'translate-x-full' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-md font-semibold ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
                  Annual
                </span>
                <span className="text-xs text-green-300 font-medium ml-2">
                  (Save 20%)
                </span>
              </div>

              {/* Tier Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {creator.membership_tiers.map((tier, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800 p-8 rounded-xl border-2 border-[#4040FF] flex flex-col"
                  >
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                      <div className="flex items-baseline mb-4">
                        <span className="text-3xl font-bold text-white">
                          ${isAnnual ? 
                            (Number(tier.price) * 12 * 0.8).toFixed(2) : 
                            tier.price}
                        </span>
                        <span className="text-gray-400 ml-1">/{isAnnual ? 'year' : 'month'}</span>
                      </div>
                      <p className="text-gray-300 mb-4">{tier.description}</p>
                      <ul className="space-y-2">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-300">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className="w-full mt-6 bg-[#4040FF] text-white py-2 rounded-lg font-semibold hover:bg-[#3030DD] transition-colors">
                      Join
                    </button>
                  </div>
                ))}
              </div>

              {/* Share Button */}
              <div className="flex justify-center w-full mb-8">
                <div className="flex items-center justify-between bg-[#4040FF] rounded-full p-1 w-80">
                  <span className="text-white font-semibold px-4 py-2">Share with a friend</span>
                  <button className="bg-white text-black px-8 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                    Share
                  </button>
                </div>
              </div>

              {/* Create First Post Button */}
              <div className="flex justify-center w-full">
                <button 
                  onClick={() => router.push('/create-post')}
                  className="bg-gradient-to-r from-green-400 to-green-600 hover:from-[#3030DD] hover:to-[#00AAEE] 
                  text-white text-xl font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105
                  flex items-center gap-3 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticAura>
  );
} 