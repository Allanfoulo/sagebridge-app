import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(user?.email || '');
      setCompany(''); // Database doesn't have this field yet
      setBio(''); // Database doesn't have this field yet
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      
      const result = await updateProfile({
        full_name: fullName,
        // We know these fields don't exist yet in the database
        // but we'll keep them in the interface for future use
      });

      if (result) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "An unexpected error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your personal information and profile settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col items-center gap-2 sm:w-1/3">
              <Avatar className="h-24 w-24">
                {avatarUrl ? (
                  <AvatarImage alt="User avatar" src={avatarUrl} />
                ) : (
                  <AvatarFallback className="text-2xl">{getInitials(fullName || 'User')}</AvatarFallback>
                )}
              </Avatar>
              <Button variant="outline" size="sm" className="mt-2 gap-1">
                <Upload className="h-4 w-4" /> Upload
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-1">
                JPG, GIF or PNG. Max size 1MB.
              </p>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Enter your full name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email" 
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  placeholder="Enter your company" 
                  disabled
                />
                <p className="text-xs text-muted-foreground">Company field will be available soon</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell us a little about yourself" 
                  rows={4}
                  disabled
                />
                <p className="text-xs text-muted-foreground">Bio field will be available soon</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
