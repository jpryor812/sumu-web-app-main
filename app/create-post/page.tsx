'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SideNav from "@/components/SideNav";
import StaticAura from "@/components/StaticAura";
import RichTextEditor from '@/components/post-setup/RichTextEditor';

interface PostFormData {
  title: string;
  content: string;
  coverImage: File | null;
  tierAccess: string;
}

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState('16rem');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    coverImage: null,
    tierAccess: 'all'
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add your submission logic here
      // Submit post with 'blog' type
      const postData = {
        ...formData,
        type: 'blog' // Always use blog type for backend compatibility
      };
      
      // Submit postData to your backend
      console.log('Submitting post:', postData);
      
      // Example submission code (uncomment and adapt as needed)
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(postData),
      // });
      
      // if (response.ok) {
      //   router.push('/dashboard');
      // } else {
      //   const data = await response.json();
      //   setError(data.message || 'An error occurred');
      // }
      
    } catch (error) {
      setError('An error occurred while publishing your post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaticAura>
      <div className="flex min-h-screen">
        <SideNav width={sidebarWidth} />
        
        <div className="flex-1 flex justify-center p-8" style={{ marginLeft: sidebarWidth }}>
          <div className="w-full max-w-2xl">
            <h1 className="text-white text-3xl font-bold mb-8 text-center">Create New Post</h1>
            
            {/* Error display */}
            {error && (
              <div className="bg-red-500 text-white p-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Post title"
                required
              />

              {/* Rich Text Editor */}
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({...formData, content})}
              />

              {/* Access Level */}
              <div className="relative">
              <select
                value={formData.tierAccess}
                onChange={(e) => setFormData({...formData, tierAccess: e.target.value})}
                className="w-full bg-gray-700 text-white p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">Free Preview</option>
                <option value="basic">Basic Tier & Above</option>
                <option value="premium">Premium Tier & Above</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </StaticAura>
  );
}