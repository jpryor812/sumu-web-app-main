// components/auth/SignUpForm.tsx
import React from 'react';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

interface FormData {
  fullName: string;
  email: string;
  password: string;
}

export default function SignUpForm(): React.ReactElement {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
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
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            onboarding_step: 'profile_details' // Track onboarding progress
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Store user ID in local storage to reference during onboarding
        localStorage.setItem('creatorId', data.user.id);
        
        // Redirect to the next step
        router.push('/signup/profile-details');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Creator Account</h2>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 text-white"
            required
            minLength={6}
          />
          <p className="text-xs text-gray-400 mt-1">
            Must be at least 6 characters
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded transition duration-200"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Next'}
        </button>
        
        <p className="text-center mt-4 text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-green-400 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}