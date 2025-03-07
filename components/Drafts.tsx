'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Define the Post interface
interface Post {
  id: string;
  title: string;
  subtitle?: string | null;
  content: any;
  tier_access: string;
  creator_id: string;
  is_published: boolean;
  is_preview: boolean;
  created_at: string;
  published_at?: string | null;
  cover_image?: string | null;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('creator_id', user.id)
          .eq('is_published', false)
          .eq('is_preview', false)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDrafts(data || []);
      } catch (error) {
        console.error('Error fetching drafts:', error);
        toast.error('Failed to load drafts');
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handlePublish = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          is_published: true,
          is_preview: false,
          published_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setDrafts(drafts.filter(draft => draft.id !== id));
      toast.success('Post published successfully!');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setDrafts(drafts.filter(draft => draft.id !== id));
      toast.success('Draft deleted');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Your Drafts</h1>
        <Link
          href="/create-post"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Create New Post
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : drafts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="mb-4">You don't have any drafts yet.</p>
          <Link
            href="/create-post"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white">{draft.title}</h2>
              {draft.subtitle && (
                <p className="text-gray-400 mt-1">{draft.subtitle}</p>
              )}
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Last updated: {new Date(draft.created_at).toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  <Link
                    href={`/create-post?id=${draft.id}`}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handlePublish(draft.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}