
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Key, 
  Moon, 
  Sun,
  LogOut
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

const Settings: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-6 lg:py-8 max-w-5xl">
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <TabsList className="flex-col h-auto p-0 bg-transparent space-y-1 md:min-w-44 w-full md:w-auto mb-6 md:mb-0">
              <TabsTrigger 
                value="profile" 
                className="justify-start w-full py-2 px-3 data-[state=active]:bg-secondary"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="justify-start w-full py-2 px-3 data-[state=active]:bg-secondary"
              >
                <Sun className="mr-2 h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="justify-start w-full py-2 px-3 data-[state=active]:bg-secondary"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="justify-start w-full py-2 px-3 data-[state=active]:bg-secondary"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1">
              <TabsContent value="profile" className="m-0">
                <ProfileSettings />
              </TabsContent>
              
              <TabsContent value="appearance" className="m-0">
                <AppearanceSettings />
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <SecuritySettings />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
