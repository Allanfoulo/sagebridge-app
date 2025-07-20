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
    const checkProfileCompletion = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('first_name, last_name, user_type')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Check if essential profile fields are completed
        const profileComplete = !!
          data &&
          data.first_name &&
          data.last_name &&
          data.user_type;

        setIsComplete(profileComplete);
      } catch (err: any) {
        console.error('Error checking profile completion:', err);
        setError(err.message || 'Failed to check profile completion');
        // If there's an error fetching profile, assume it's not complete
        setIsComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfileCompletion();
  }, [user]);

  return { isComplete, loading, error };
};

export default useProfileCompletion;