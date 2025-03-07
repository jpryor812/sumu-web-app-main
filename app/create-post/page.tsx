'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SideNav from "@/components/SideNav";
import StaticAura from "@/components/StaticAura";
import RichTextEditor from '@/components/post-setup/RichTextEditor';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface PostFormData {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  tierAccess: string;
}

interface MembershipTier {
  id: string;
  name: string;
  price: string;
  features: string[];
  description: string;
  order?: number;
}

interface Tier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  order?: number; // Optional order property
}

export default function CreatePost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const { user } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState('16rem');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PostFormData>({
    id: '',
    title: '',
    subtitle: '',
    content: '',
    coverImage: '',
    tierAccess: 'all'
  });

  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [editorSideTipVisible, setEditorSideTipVisible] = useState(true);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);

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

  useEffect(() => {
    // Fetch the creator's membership tiers from the creators table
    const fetchMembershipTiers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get the creator's profile which contains the membership tiers
        const { data, error } = await supabase
          .from('creators')
          .select('membership_tiers')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // Set the membership tiers from the creator's profile
        if (data && data.membership_tiers) {
          const tiersWithIds = data.membership_tiers.map((tier: any, index: number) => ({
            ...tier,
            id: `tier_${index}`,
            order: index
          }));
          setMembershipTiers(tiersWithIds);
          setTiers(tiersWithIds);
        } else {
          setMembershipTiers([]);
          setTiers([]);
        }
      } catch (error) {
        console.error('Error fetching membership tiers:', error);
        toast.error('Failed to load membership tiers');
      } finally {
        setLoadingTiers(false);
      }
    };

    // If postId exists, fetch the post data for editing
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;
        
        if (data) {
          setFormData({
            id: data.id,
            title: data.title || '',
            subtitle: data.subtitle || '',
            content: data.content || '',
            tierAccess: data.tier_access || 'all',
            coverImage: data.cover_image || ''
          });
          
          // If the post has a tier access setting, select that tier
          if (data.tier_access && data.tier_access !== 'all') {
            setSelectedTiers([data.tier_access]);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
      }
    };

    fetchMembershipTiers();
    fetchPost();
  }, [postId]);

  const handleTierChange = (tierId: string, isChecked: boolean) => {
    let newSelectedTiers = [...selectedTiers];
    
    if (isChecked) {
      // If checking a tier, add it and all higher tiers
      const tierIndex = tiers.findIndex(tier => tier.id === tierId);
      
      // Guard against invalid tier ID
      if (tierIndex === -1) {
        console.error(`Tier with ID ${tierId} not found`);
        return;
      }
      
      const tiersToAdd = tiers
        .filter((_, index) => index >= tierIndex)
        .map(tier => tier.id);
      
      // Combine existing selections with new ones, removing duplicates
      newSelectedTiers = [...new Set([...newSelectedTiers, ...tiersToAdd])];
    } else {
      // If unchecking, just remove this specific tier
      newSelectedTiers = newSelectedTiers.filter(id => id !== tierId);
    }
    
    setSelectedTiers(newSelectedTiers);
    
    // If no tiers are selected, set to 'all' (public access)
    // Otherwise, use the lowest selected tier
    if (newSelectedTiers.length === 0) {
      setFormData({...formData, tierAccess: 'all'});
    } else {
      // Find the lowest tier that is selected
      const lowestSelectedTier = tiers.reduce((lowest: MembershipTier | null, current) => {
        // Only consider tiers that are selected
        if (!newSelectedTiers.includes(current.id)) {
          return lowest;
        }
        
        // If we don't have a lowest tier yet, use this one
        if (!lowest) {
          return current;
        }
        
        // Compare order if available, otherwise use array index
        const currentOrder = current.order !== undefined ? current.order : 
          tiers.findIndex(t => t.id === current.id);
        const lowestOrder = lowest.order !== undefined ? lowest.order : 
          tiers.findIndex(t => t.id === lowest.id);
        
        return currentOrder < lowestOrder ? current : lowest;
      }, null);
      
      // Set the tierAccess to the ID of the lowest selected tier, or 'all' if none found
      setFormData({
        ...formData, 
        tierAccess: lowestSelectedTier ? lowestSelectedTier.id : 'all'
      });
    }
  };

  const savePostToSupabase = async (isPublished = false, isPreview = false) => {
    if (!formData.title) {
      toast.error('Please add a title');
      return null;
    }

    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Prepare the post data
      const postData = {
        id: formData.id || undefined,
        title: formData.title,
        subtitle: formData.subtitle || null,
        content: formData.content,
        tier_access: formData.tierAccess,
        cover_image: formData.coverImage || null,
        is_published: isPublished,
        is_preview: isPreview,
        published_at: isPublished ? new Date().toISOString() : null
      };

      // Save to Supabase
      const { data: post, error } = await supabase
        .from('posts')
        .upsert(postData)
        .select()
        .single();

      if (error) throw error;
      
      toast.success(isPublished ? 'Post published!' : (isPreview ? 'Preview ready' : 'Draft saved'));
      return post;
    } catch (error) {
      console.error('Failed to save post:', error);
      toast.error('Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const post = await savePostToSupabase(false, false);
    if (post) {
      router.push('/dashboard/drafts');
    }
  };

  const handlePreview = async () => {
    const post = await savePostToSupabase(false, true);
    if (post) {
      router.push(`/create-post/preview?id=${post.id}`);
    }
  };

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const post = await savePostToSupabase(true, false);
    if (post) {
      router.push('/dashboard');
    }
  };

  // Editor Side Tip Component
  const EditorSideTip = () => {
    return (
      <div className="hidden xl:block fixed left-[calc(50%-600px+130px)] top-1/2 transform -translate-y-1/2 bg-gray-800 p-4 rounded-lg border border-gray-700 text-gray-300 text-sm w-64">
        <h4 className="font-medium text-white mb-2">Content Tips</h4>
        <p className="mb-2">You can use this editor to post:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Blog posts</li>
          <li>Images</li>
          <li>Videos</li>
          <li>Polls</li>
        </ul>
        <p className="mt-2 text-xs text-gray-400">Use the toolbar above to format your content.</p>
      </div>
    );
  };

  return (
    <StaticAura>
      <div className="flex min-h-screen">
        <SideNav width={sidebarWidth} />
        
        <div className="flex-1 flex justify-center p-8" style={{ marginLeft: sidebarWidth }}>
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              {postId ? 'Edit Post' : 'Create New Post'}
            </h1>
            
            {/* Error display */}
            {error && (
              <div className="bg-red-500 text-white p-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {editorSideTipVisible && <EditorSideTip />}
            
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <form onSubmit={handlePublish} className="space-y-6">
                  {/* Title input */}
                  <input
                    type="text"
                    placeholder="Post title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-700 text-white text-3xl p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  
                  {/* Subtitle input */}
                  <input
                    type="text"
                    placeholder="Subtitle (optional)"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-gray-700 text-white p-3 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Rich Text Editor */}
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({...formData, content})}
                    placeholder="Write your blog post or post your images, videos, and polls here..."
                  />
                  
                  {/* Tier selection */}
                  <div className="space-y-3 bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-medium mb-2">Who is This For? (Select all that apply)</div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                      </label>
                      
                      {loadingTiers ? (
                        <div className="py-2 text-gray-400">Loading membership tiers...</div>
                      ) : tiers.length === 0 ? (
                        <div className="py-2 text-gray-400">
                          No membership tiers found. 
                          <Link href="/dashboard/settings" className="text-blue-400 ml-1 hover:underline">
                            Create tiers
                          </Link>
                        </div>
                      ) : (
                        tiers.map((tier, index) => (
                          <label key={tier.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedTiers.includes(tier.id)}
                              onChange={(e) => handleTierChange(tier.id, e.target.checked)}
                              className="form-checkbox"
                            />
                            <span className="text-white">{tier.name} (${tier.price})</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleSaveAsDraft}
                      disabled={loading}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={handlePreview}
                      disabled={loading}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                      Preview
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                      Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticAura>
  );
}