'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import PostContent from '@/components/post/PostContent';

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: any; // Or a more specific type for your Lexical content
  tier_access: string;
  is_published: boolean;
  is_preview: boolean;
  created_at: string;
  published_at?: string;
  creator?: {
    id: string;
    email?: string;
    display_name?: string;
    profile_media_url?: string;
  };
}

export default function PostPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!postId) {
      toast.error('No post ID provided');
      router.push('/create-post');
      return;
    }

    const fetchPostData = async () => {
      try {
        const { data: post, error } = await supabase
          .from('posts')
          .select(`
            *,
            creator:creator_id (
              id,
              email,
              display_name,
              profile_media_url
            )
          `)
          .eq('id', postId)
          .single();

        if (error) throw error;
        setPostData(post);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        toast.error('Failed to load preview');
        router.push('/create-post');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, router]);

  const handlePublish = async () => {
    try {
      setPublishing(true);
      const { error } = await supabase
        .from('posts')
        .update({
          is_published: true,
          is_preview: false,
          published_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      toast.success('Post published successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to publish post:', error);
      toast.error('Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Preview Header */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold">Post Preview</h2>
          <div className="flex gap-3">
            <Link
              href={`/create-post?id=${postId}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              Back to Edit
            </Link>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
            >
              {publishing ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </div>

        {/* Post Content */}
        {postData && (
          <article className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Post Header */}
            <div className="p-6 border-b border-gray-700">
              <h1 className="text-3xl font-bold mb-2">{postData.title || 'Untitled'}</h1>
              {postData.subtitle && (
                <h2 className="text-xl text-gray-300 mb-4">{postData.subtitle}</h2>
              )}
              
              <div className="flex items-center text-sm text-gray-400">
                <div className="flex items-center">
                  {postData.creator?.profile_media_url && (
                    <img 
                      src={postData.creator.profile_media_url} 
                      alt={postData.creator.display_name || 'Author'}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  )}
                  <span>{postData.creator?.display_name || postData.creator?.email || 'Anonymous'}</span>
                </div>
                <span className="mx-2">•</span>
                <time>{new Date(postData.created_at || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</time>
                
                {postData.tier_access && postData.tier_access !== 'all' && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-yellow-500">
                      {postData.tier_access.charAt(0).toUpperCase() + postData.tier_access.slice(1)} Tier
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Post Body */}
            <div className="p-6">
              {postData.content && <PostContent content={postData.content} />}
            </div>
          </article>
        )}
      </div>
    </div>
  );
} 