'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SideNav from "@/components/SideNav";
import StaticAura from "@/components/StaticAura";
import RichTextEditor, { extractHtmlContent } from '@/components/post-setup/RichTextEditor';
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

  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [editorSideTipVisible, setEditorSideTipVisible] = useState(true);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  // Handle responsive sidebar
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

  // Fetch membership tiers and post data (combined effect)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('You must be logged in');
          return;
        }

        // Fetch membership tiers
        try {
          const { data: creatorData, error: tierError } = await supabase
            .from('creators')
            .select('membership_tiers')
            .eq('id', user.id)
            .single();

          if (tierError) throw tierError;
          
          if (creatorData && creatorData.membership_tiers) {
            const tiersWithIds = creatorData.membership_tiers.map((tier: any, index: number) => ({
              ...tier,
              id: `tier_${index}`,
              order: index
            }));
            setTiers(tiersWithIds);
          } else {
            setTiers([]);
          }
        } catch (tierError) {
          console.error('Error fetching membership tiers:', tierError);
        } finally {
          setLoadingTiers(false);
        }

        // Fetch post data if editing an existing post
        if (postId) {
          setLoading(true);
          
          const { data: post, error: postError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .eq('creator_id', user.id)
            .single();
          
          if (postError) {
            console.error('Error loading post:', postError);
            toast.error('Failed to load post');
            setLoading(false);
            return;
          }
          
          if (!post) {
            toast.error('Post not found');
            setLoading(false);
            return;
          }
          
          // Set the form data with the loaded post
          setFormData({
            id: post.id,
            title: post.title || '',
            subtitle: post.subtitle || '',
            content: post.content, // Keep the original format
            coverImage: post.cover_image || '',
            tierAccess: post.tier_access || 'all'
          });
          
          // Set selected tiers
          if (post.tier_access && post.tier_access !== 'all') {
            setSelectedTiers([post.tier_access]);
          }
          
          toast.success('Post loaded');
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Something went wrong');
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handleTierChange = (tierId: string, isChecked: boolean) => {
    let newSelectedTiers = [...selectedTiers];
    
    if (isChecked) {
      // If checking a tier, add it and all higher tiers
      const tierIndex = tiers.findIndex(tier => tier.id === tierId);
      
      if (tierIndex === -1) {
        console.error(`Tier with ID ${tierId} not found`);
        return;
      }
      
      const tiersToAdd = tiers
        .filter((_, index) => index >= tierIndex)
        .map(tier => tier.id);
      
      newSelectedTiers = [...new Set([...newSelectedTiers, ...tiersToAdd])];
    } else {
      // If unchecking, just remove this specific tier
      newSelectedTiers = newSelectedTiers.filter(id => id !== tierId);
    }
    
    setSelectedTiers(newSelectedTiers);
    
    // Update the tierAccess in formData based on selections
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
      
      setFormData({
        ...formData, 
        tierAccess: lowestSelectedTier ? lowestSelectedTier.id : 'all'
      });
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const savePostToSupabase = async (isPublished = false, isPreview = false) => {
    if (!formData.title) {
      toast.error('Please add a title');
      return null;
    }

    try {
      setLoading(true);
      
      // Get the current user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        toast.error('You must be logged in');
        return null;
      }
      
      const user = authData.user;

      // Before the try-catch block, define contentToSave with a more flexible type
      let contentToSave: string | { html: string };

      // Then in your code
      try {
        contentToSave = JSON.parse(formData.content);
      } catch (e) {
        contentToSave = { html: formData.content }; // Now this works
      }

      // Later in the same function
      if (typeof formData.content === 'string') {
        contentToSave = { html: formData.content }; // This also works
      }

      // When using contentToSave, you may need to extract the HTML content:
      const htmlContent = typeof contentToSave === 'string' 
        ? contentToSave 
        : contentToSave.html;

      // Prepare the post data
      const postData = {
        id: formData.id || undefined,
        title: formData.title,
        subtitle: formData.subtitle || null,
        content: htmlContent, // Use our processed content
        tier_access: formData.tierAccess,
        cover_image: formData.coverImage || null,
        is_published: isPublished,
        is_preview: isPreview,
        published_at: isPublished ? new Date().toISOString() : null
      };

      let post;
      
      if (formData.id) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', formData.id)
          .select()
          .single();
        
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        
        post = data;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert({
            ...postData,
            creator_id: user.id
          })
          .select()
          .single();
        
        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        
        post = data;
        
        // Update form with the new post ID
        setFormData(prev => ({
          ...prev,
          id: post.id
        }));
      }

      toast.success(
        isPublished 
          ? 'Post published successfully!' 
          : isPreview 
            ? 'Preview ready' 
            : 'Draft saved'
      );
      
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
    if (!formData.title) {
      toast.error('Please add a title before previewing');
      return;
    }
    
    // Save the post as a preview
    const post = await savePostToSupabase(false, true);
    
    if (post) {
      // Navigate to preview with the post ID
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
                    onChange={handleEditorChange}
                    placeholder="Write your blog post or post your images, videos, and polls here..."
                  />
                  
                  {/* Tier selection */}
                  <div className="space-y-3 bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-medium mb-2">Who is This For? (Select all that apply)</div>
                    <div className="space-y-2">
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
                        tiers.map((tier) => (
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