'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SideNav from "@/components/SideNav";
import StaticAura from "@/components/StaticAura";
import PostImageUploader from '@/components/post-setup/PostImageUploader';
import { Link, Image as ImageIcon, FileText, Video } from 'lucide-react';
import RichTextEditor from '@/components/post-setup/RichTextEditor';

type PostType = 'blog' | 'image' | 'video' | 'link';

interface PostFormData {
  type: PostType;
  title: string;
  content: string;
  coverImage: File | null;
  videoUrl?: string;
  linkUrl?: string;
  tierAccess: string;
}

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState('16rem');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postType, setPostType] = useState<PostType>('blog');
  
  const [formData, setFormData] = useState<PostFormData>({
    type: 'blog',
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
    // Add submission logic here
  };

  return (
    <StaticAura>
      <div className="flex min-h-screen">
        <SideNav width={sidebarWidth} />
        
        <div className="flex-1 flex justify-center p-8" style={{ marginLeft: sidebarWidth }}>
          <div className="w-full max-w-2xl">
            <h1 className="text-white text-3xl font-bold mb-8 text-center">Create New Post</h1>
            
            {/* Post Type Selector */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { type: 'blog', icon: FileText, label: 'Blog Post' },
                { type: 'image', icon: ImageIcon, label: 'Image' },
                { type: 'video', icon: Video, label: 'Video' },
                { type: 'link', icon: Link, label: 'Link' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => {
                    setPostType(type as PostType);
                    setFormData(prev => ({ ...prev, type: type as PostType }));
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all
                    ${postType === type 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title (common for all types) */}
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`${postType === 'blog' ? 'Blog title' : 
                            postType === 'image' ? 'Image title' :
                            postType === 'video' ? 'Video title' : 'Link title'}`}
              />

              {/* Type-specific content */}
              {postType === 'blog' && (
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({...formData, content})}
                />
              )}

              {postType === 'image' && (
                <div className="space-y-4">
                  <PostImageUploader 
                    label="Upload Image"
                    description="Share your artwork, photo, or other image"
                    file={formData.coverImage}
                    handleFileChange={(file) => setFormData({...formData, coverImage: file})}
                    setError={setError}
                  />
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a description..."
                  />
                </div>
              )}

              {postType === 'video' && (
                <div className="space-y-4">
                  <input
                    type="url"
                    value={formData.videoUrl || ''}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste your YouTube or Twitch URL"
                  />
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a description..."
                  />
                </div>
              )}

              {postType === 'link' && (
                <div className="space-y-4">
                  <input
                    type="url"
                    value={formData.linkUrl || ''}
                    onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste your link URL"
                  />
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add your thoughts about this link..."
                  />
                </div>
              )}

              {/* Access Level (common for all types) */}
              <select
                value={formData.tierAccess}
                onChange={(e) => setFormData({...formData, tierAccess: e.target.value})}
                className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Free Preview</option>
                <option value="basic">Basic Tier & Above</option>
                <option value="premium">Premium Tier & Above</option>
              </select>

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