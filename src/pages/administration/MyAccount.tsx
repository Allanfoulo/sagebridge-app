
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Mail, Phone, Building, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Remove validations for fields that don't exist yet
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  role: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const MyAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      role: 'User',
    },
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      reset({
        name: data.full_name || '',
        email: user?.email || '',
        phone: '', // Default empty string for now
        company: '', // Default empty string for now
        address: '', // Default empty string for now
        role: 'User', // Default role
      });

      setAvatarUrl(data.avatar_url);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data. ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    try {
      // Only update fields that exist in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Profile has been updated successfully',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. ' + error.message,
        variant: 'destructive',
      });
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 flex justify-center items-center h-[calc(100vh-6rem)]"
      >
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading account information...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
          onClick={() => navigate('/administration')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Administration
        </Button>
      </div>

      {/* Header Section */}
      <div className="bg-blue-600 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-white mb-2">My Account</h1>
        <p className="text-white/80">View and update your profile information</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : (
                  <AvatarFallback>{getInitials(user?.email?.split('@')[0] || 'U')}</AvatarFallback>
                )}
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border-2 border-gray-200"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.email?.split('@')[0]}</h2>
              <p className="text-gray-500">User</p>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  {...register('email')}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  disabled
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phone"
                  {...register('phone')}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground">Phone number field will be available soon</p>
            </div>

            {/* Company Field */}
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="company"
                  {...register('company')}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground">Company field will be available soon</p>
            </div>

            {/* Address Field */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Input
                  id="address"
                  {...register('address')}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground">Address field will be available soon</p>
            </div>
          </div>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/administration')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default MyAccount;
