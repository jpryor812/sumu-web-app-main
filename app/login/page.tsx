'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle redirection when user state changes
  useEffect(() => {
    if (user) {
      const onboardingStep = user.user_metadata?.onboarding_step;
      
      if (onboardingStep === 'profile_details') {
        router.push('/signup/create-profile');
      } else if (onboardingStep === 'creator_setup') {
        router.push('/signup/creator-setup');
      } else if (onboardingStep === 'complete') {
        router.push('/dashboard');
      } else {
        router.push('/signup/create-profile');
      }
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      // Redirection will be handled by the useEffect above
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <h1 className="text-center text-3xl font-extrabold text-white">
          Sign In to SUMU
        </h1>
        <p className="mt-2 text-center text-gray-400">
          Access your creator account
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
            />
            <div className="flex justify-end mt-1">
              <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded transition duration-200"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <p className="text-center mt-4 text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 