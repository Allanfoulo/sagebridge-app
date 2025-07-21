import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ProfileData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_type: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

const ProfileDebugger: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (forceRefresh = false) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      
      // Force refresh by adding a timestamp to bypass any caching
      if (forceRefresh) {
        query = query.limit(1);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) {
        setError(error.message);
      } else {
        setProfileData(data);
        console.log('Fetched profile data:', data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const isProfileComplete = profileData && 
    profileData.first_name && 
    profileData.last_name && 
    profileData.user_type;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Profile Debug Information
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProfile(false)}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProfile(true)}
              disabled={loading}
            >
              Force Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {user && (
          <div className="space-y-2">
            <h3 className="font-semibold">Auth User Info:</h3>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
        )}

        {profileData ? (
          <div className="space-y-2">
            <h3 className="font-semibold">Profile Data:</h3>
            <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
              <p><strong>ID:</strong> {profileData.id}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>First Name:</strong> {profileData.first_name || 'NULL'}</p>
              <p><strong>Last Name:</strong> {profileData.last_name || 'NULL'}</p>
              <p><strong>User Type:</strong> {profileData.user_type || 'NULL'}</p>
              <p><strong>Full Name:</strong> {profileData.full_name || 'NULL'}</p>
              <p><strong>Phone:</strong> {profileData.phone || 'NULL'}</p>
              <p><strong>Created At:</strong> {profileData.created_at}</p>
              <p><strong>Updated At:</strong> {profileData.updated_at}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">No profile data found in database</p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold">Profile Completion Status:</h3>
          <div className={`p-3 rounded-md text-sm ${
            isProfileComplete 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p><strong>Complete:</strong> {isProfileComplete ? 'YES' : 'NO'}</p>
            <p><strong>Reason:</strong> {
              !profileData ? 'No profile record exists' :
              !profileData.first_name ? 'Missing first_name' :
              !profileData.last_name ? 'Missing last_name' :
              !profileData.user_type ? 'Missing user_type' :
              'Profile is complete'
            }</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDebugger;