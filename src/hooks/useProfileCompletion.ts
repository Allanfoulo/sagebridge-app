import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileCompletionStatus {
  isComplete: boolean;
  loading: boolean;
  error: string | null;
}

export const useProfileCompletion = (): ProfileCompletionStatus => {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      if (!user) {
        setIsComplete(false);
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, user_type')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          setError(error.message);
          setIsComplete(false);
        } else if (!profile) {
          // Profile doesn't exist yet, so it's not complete
          setIsComplete(false);
        } else {
          // Check if all required fields are present
          const isProfileComplete = !!
            (profile?.first_name && 
             profile?.last_name && 
             profile?.user_type);
          
          setIsComplete(isProfileComplete);
        }
      } catch (err: any) {
        console.error('Error in fetchProfileCompletion:', err);
        setError(err.message);
        setIsComplete(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileCompletion();
  }, [user]);

  return { isComplete, loading, error };
};

export default useProfileCompletion;