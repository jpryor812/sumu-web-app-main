'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import PostContent from '@/components/post/PostContent'; 
interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: {
    html: string;
  } | string | null; // Allow for different content formats
  cover_image?: string;
  created_at: string;
  creator_id: string;
  creator?: {
    display_name: string;
    profile_media_url?: string;
    banner_image_url?: string;
    content_category?: string;
    bio?: string;
    social_links?: any;
  };
}

export default function PostPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  
  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false); // Toggle for debug info

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError('No post ID provided');
        toast.error('No post ID provided');
        router.push('/create-post');
        return;
      }

      try {
        setLoading(true);
        
        // First, check if the user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Authentication error:', authError);
          throw new Error('You must be logged in to view this preview');
        }
        
        if (!user) {
          throw new Error('You must be logged in to view this preview');
        }
        
        console.log('Fetching post with ID:', postId);
        
        // Fetch the post with creator information
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .eq('creator_id', user.id) // Ensure the user can only see their own posts
          .single();
        
        if (postError) {
          console.error('Database error:', postError);
          throw new Error('Failed to load post: ' + postError.message);
        }
        
        if (!post) {
          throw new Error('Post not found or you do not have permission to view it');
        }
        
        // Fetch creator info from the creators table
        console.log('Fetching creator with ID:', post.creator_id);
        const { data: creatorData, error: creatorError } = await supabase
          .from('creators')
          .select('display_name, content_category, bio, profile_media_url, banner_image_url')
          .eq('id', post.creator_id)
          .single();
        
        if (creatorError) {
          console.error('Error fetching creator:', creatorError);
        }
        
        // Combine the data
        const postWithCreator = {
          ...post,
          creator: creatorData || {
            display_name: user.email?.split('@')[0] || 'Creator', // Fallback to email username
            content_category: 'General',
            bio: null,
            profile_media_url: null,
            banner_image_url: null
          }
        };
        
        setPostData(postWithCreator);
      } catch (error: unknown) {
        let errorMessage = 'Failed to fetch post';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        console.error('Failed to fetch post:', error);
        setError(errorMessage);
        toast.error(errorMessage);
        
        // Only redirect if it's a permission or not found error
        if (errorMessage.includes('not found') || errorMessage.includes('permission')) {
          router.push('/create-post');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="h-64 bg-gray-700 rounded mb-6"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Preview</h1>
            <p className="text-white mb-6">{error || 'Failed to load post data'}</p>
            <Link href="/create-post" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Return to Editor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Preview banner */}
        <div className="bg-yellow-600 text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
          <span className="font-medium">Preview Mode</span>
          <div className="space-x-4">
            <Link href={`/create-post?id=${postId}`} className="underline hover:text-yellow-200">
              Edit
            </Link>
            <button 
              onClick={() => router.push(`/create-post?id=${postId}`)} 
              className="bg-yellow-700 hover:bg-yellow-800 px-3 py-1 rounded"
            >
              Back to Editor
            </button>
            
            {/* Toggle for debug info */}
            <button 
              onClick={() => setShowDebug(!showDebug)} 
              className="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-xs"
            >
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
          </div>
        </div>
        
        {/* Post content */}
        <article className="bg-gray-800 rounded-b-lg p-6">
          {postData.cover_image && (
            <div className="mb-6">
              <img 
                src={postData.cover_image} 
                alt={postData.title} 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-white mb-2">{postData.title}</h1>
          
          {postData.subtitle && (
            <h2 className="text-xl text-gray-300 mb-6">{postData.subtitle}</h2>
          )}
          
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3 overflow-hidden">
              {postData.creator?.profile_media_url ? (
                <img 
                  src={postData.creator.profile_media_url} 
                  alt={postData.creator?.display_name || 'Creator'} 
                  className="w-10 h-10 object-cover"
                />
              ) : (
                <span className="text-white font-medium">
                  {(postData.creator?.display_name || 'C')[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="text-white font-medium">
                {postData.creator?.display_name || 'Creator'}
              </div>
              <div className="text-gray-400 text-sm">
                {new Date(postData.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Debug info (togglable) */}
          {showDebug && (
            <div className="bg-gray-900 p-2 mb-4 rounded text-xs">
              <p>Content type: {typeof postData.content}</p>
              <p>Content structure: {JSON.stringify(postData.content)}</p>
              <p>Content length: {JSON.stringify(postData.content).length} characters</p>
              <p>Content preview: {JSON.stringify(postData.content).substring(0, 100)}...</p>
            </div>
          )}
          
          {/* Content rendering using PostContent component */}
          <div className="mt-6">
            <PostContent content={postData.content} />
          </div>
        </article>
      </div>
    </div>
  );
}