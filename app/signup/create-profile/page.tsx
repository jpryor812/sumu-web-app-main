'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { User } from '@supabase/supabase-js';
import { UserMetadata } from '../../../types/supabase';
import React from 'react';

// Content categories for creators to choose from
const CONTENT_CATEGORIES = [
  'Art',
  'Music',
  'Video & Film',
  'Photography',
  'Education',
  'Gaming',
  'Podcasts',
  'Technology',
  'Finance',
  'Other'
];

interface ProfileFormData {
  displayName: string;
  category: string;
}

export default function CreateProfile(): React.ReactElement {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    category: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async (): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to sign up if not authenticated
        router.push('/signup');
        return;
      }
      
      setUser(user);
      
      // Pre-fill display name with full name if available
      const metadata = user.user_metadata as UserMetadata;
      if (metadata?.full_name) {
        setFormData(prev => ({
          ...prev,
          displayName: metadata.full_name || ''
        }));
      }
    };
    
    checkUser();
  }, [router]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!user) throw new Error("User not authenticated");
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: formData.displayName,
          content_category: formData.category,
          onboarding_step: 'creator_setup'
        }
      });
      
      if (updateError) throw updateError;
      
      // Create a record in the creators table
      const { error: insertError } = await supabase
        .from('creators')
        .insert({
          id: user.id,
          display_name: formData.displayName,
          content_category: formData.category,
          created_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      
      // Redirect to the next step
      router.push('/signup/creator-setup');
    } catch (error: any) {
      console.error('Error saving profile details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <h1 className="text-center text-3xl font-extrabold text-white">
          Complete Your Profile
        </h1>
        <p className="mt-2 text-center text-gray-400">
          Tell us more about your creative work
        </p>
      </div>
      
      <div className="max-w-md w-full mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="displayName">
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              This is how you'll appear to your audience
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="category">
              Content Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white"
              required
            >
              <option value="">Select a category</option>
              {CONTENT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded transition duration-200"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
        </form>
      </div>
    </div>
  );
}