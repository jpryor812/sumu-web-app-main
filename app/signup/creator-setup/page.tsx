'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideNav from "@/components/SideNav";
import { supabase } from '@/lib/supabase';      
import { useAuth } from '@/contexts/AuthContext';
import ImageUploader from '@/components/creator-setup/ImageUploader';
import BioSection from '@/components/creator-setup/BioSection';
import TierManager from '@/components/creator-setup/TierManager';
import PagePreview from '@/components/creator-setup/PagePreview';
import PreviewButton from '@/components/creator-setup/PreviewButton';
import VideoUploader from '@/components/creator-setup/VideoUploader';

// Define a tier type for better type safety
export interface Tier {
  name: string;
  price: string;
  description: string;
  features: string[];
}

export default function CreatorSetup() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState('16rem');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    bannerImage: null as File | null,
    profileMedia: null as File | null,
    isProfileVideo: false,
  });
  
  // Initialize with two default tiers
  const [tiers, setTiers] = useState<Tier[]>([
    {
      name: 'Basic Tier',
      price: '5',
      description: 'Basic membership benefits',
      features: ['Early access to content', 'Exclusive community access']
    },
    {
      name: 'Premium Tier',
      price: '15',
      description: 'Premium membership benefits',
      features: ['All Basic Tier benefits', 'Monthly livestreams', 'Behind the scenes content']
    }
  ]);

  const [videoOrientation, setVideoOrientation] = useState(0);

  // Handle sidebar responsiveness
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

  // Check authentication
  useEffect(() => {
    if (!user) {
      router.push('/signup');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (file: File | null, isVideo: boolean) => {
    setFormData(prev => ({
      ...prev,
      profileMedia: file,
      isProfileVideo: isVideo
    }));
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("User not authenticated");

      // Upload banner image if provided
      let bannerUrl = null;
      if (formData.bannerImage) {
        const bannerFileName = `banner-${user.id}-${Date.now()}`;
        const { error: uploadBannerError, data: bannerData } = await supabase.storage
          .from('creator-images')
          .upload(bannerFileName, formData.bannerImage);

        if (uploadBannerError) throw uploadBannerError;
        
        const { data: { publicUrl: bannerPublicUrl } } = supabase.storage
          .from('creator-images')
          .getPublicUrl(bannerFileName);
          
        bannerUrl = bannerPublicUrl;
      }

      // Upload profile image if provided
      let profileUrl = null;
      if (formData.profileMedia) {
        const profileFileName = `profile-${user.id}-${Date.now()}`;
        const { error: uploadProfileError, data: profileData } = await supabase.storage
          .from('creator-images')
          .upload(profileFileName, formData.profileMedia);

        if (uploadProfileError) throw uploadProfileError;
        
        const { data: { publicUrl: profilePublicUrl } } = supabase.storage
          .from('creator-images')
          .getPublicUrl(profileFileName);
          
        profileUrl = profilePublicUrl;
      }

      // Save creator profile to database
      const { error: creatorError } = await supabase
        .from('creators')
        .update({
          bio: formData.bio,
          banner_image_url: bannerUrl,
          profile_image_url: profileUrl,
          membership_tiers: tiers,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (creatorError) throw creatorError;

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          onboarding_step: 'complete'
        }
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error saving creator profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <SideNav width={sidebarWidth} />
      
      <div className="flex-1 p-8" style={{ marginLeft: sidebarWidth }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Complete Your Creator Profile</h1>
          
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Image Uploaders */}
            <div className="mb-2">
              <ImageUploader 
                label="Banner Image"
                description="Recommended size: 1500 x 500 pixels"
                fileType="bannerImage"
                file={formData.bannerImage}
                handleFileChange={(file) => {
                  setFormData({
                    ...formData,
                    bannerImage: file
                  });
                }}
                setError={setError}
              />
              
              {/* Center the profile media uploader */}
              <div className="flex justify-center mb-2">
                <ImageUploader 
                  label="Profile Media"
                  description="Upload an image or short video (max 30s)"
                  fileType="profileMedia"
                  file={formData.profileMedia}
                  handleFileChange={handleFileChange}
                  setError={setError}
                  isVideo={formData.isProfileVideo}
                  videoOrientation={videoOrientation}
                  setVideoOrientation={setVideoOrientation}
                />
              </div>
            </div>
            
            <BioSection 
              bio={formData.bio}
              handleChange={handleChange}
            />
            
            <TierManager 
              tiers={tiers}
              setTiers={setTiers}
              setError={setError}
            />
            
            <PreviewButton 
              onClick={togglePreview}
            />
            
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
              >
                {loading ? 'Saving...' : 'Create My Page'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Only the modal preview remains */}
      {showPreview && (
        <PagePreview 
          formData={formData}
          tiers={tiers}
          onClose={togglePreview}
          userName={user?.user_metadata?.name || user?.email}
        />
      )}
    </div>
  );
} 