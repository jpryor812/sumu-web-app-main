// types/supabase.ts
export type Creator = {
    id: string;
    display_name: string;
    content_category: string;
    bio?: string;
    profile_image_url?: string;
    banner_image_url?: string;
    social_links?: {
      twitter?: string;
      instagram?: string;
      youtube?: string;
      website?: string;
      [key: string]: string | undefined;
    };
    
    created_at: string;
    updated_at: string;
  };
  
  export type UserMetadata = {
    full_name?: string;
    display_name?: string;
    content_category?: string;
    onboarding_step?: 'profile_details' | 'creator_setup' | 'complete';
  };