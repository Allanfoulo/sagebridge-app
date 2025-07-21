import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProfileDebugger from '@/components/debug/ProfileDebugger';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProfileDebug: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile Debug</h1>
            <p className="text-muted-foreground">Diagnostic tool for profile completion issues</p>
          </div>
        </div>
        
        <ProfileDebugger />
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">How to use this debug tool:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check if your profile data exists in the database</li>
            <li>• Verify that first_name, last_name, and user_type are properly saved</li>
            <li>• Use "Force Refresh" if you suspect caching issues</li>
            <li>• Look at the browser console for additional debug information</li>
            <li>• If profile shows as incomplete, try completing the onboarding again</li>
          </ul>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ProfileDebug;