
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Aligned with actual database structure
export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  // These fields may not exist in the database yet, but we'll handle them
  company: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      // Create a profile object with all required fields, with fallbacks for missing ones
      const profileData: Profile = {
        id: data.id,
        full_name: data.full_name,
        email: user.email || '',
        avatar_url: data.avatar_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        // Default values for fields that might not exist in the database
        company: data.company || null,
        bio: data.bio || null,
        phone: data.phone || null,
        address: data.address || null,
      };

      setProfile(profileData);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error);
      toast({
        title: 'Error fetching profile',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Filter out fields that don't exist in the actual database
      const { company, bio, phone, address, ...validUpdates } = updates;
      const updateData = { ...validUpdates };
      
      // Only include fields that exist in the database schema
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });

      // Refresh profile data
      await fetchProfile();
      
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    isLoading,
    error,
    refreshProfile: fetchProfile,
    updateProfile
  };
};
