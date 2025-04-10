
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Customer {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  status: 'active' | 'inactive';
  totalSpent?: number;
  lastOrder?: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match the expected format
      const formattedCustomers = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        company: customer.company || customer.name, // Use name as company if not available
        email: customer.email,
        phone: customer.phone,
        location: [customer.city, customer.state, customer.country].filter(Boolean).join(', '),
        status: customer.is_active ? 'active' : 'inactive',
        totalSpent: 0, // We don't have this data yet
        lastOrder: new Date().toISOString(), // Placeholder
        avatar: '/placeholder.svg',
        address: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country
      }));

      setCustomers(formattedCustomers);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setError(error);
      toast({
        title: 'Error fetching customers',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    isLoading,
    error,
    refreshCustomers: fetchCustomers
  };
};
