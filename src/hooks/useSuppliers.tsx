import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  category?: string; // Derived from category_id
  category_id?: string | null; // From database
  balance?: number;
  created_at: string;
  is_active: boolean;
  status: 'Active' | 'Inactive'; // Virtual property derived from is_active
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

const useSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: 'name', direction: null });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
    setupRealtimeSubscription();

    // Cleanup function to remove subscription
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  const setupRealtimeSubscription = () => {
    console.log('Setting up real-time subscription for suppliers');
    
    const channel = supabase
      .channel('suppliers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'suppliers'
        },
        (payload) => {
          console.log('Supplier change detected:', payload);
          handleRealtimeChange(payload);
        }
      )
      .subscribe((status) => {
        console.log('Suppliers subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to suppliers changes');
        }
      });

    return channel;
  };

  const handleRealtimeChange = async (payload: any) => {
    console.log('Handling supplier realtime change:', payload.eventType);
    
    try {
      if (payload.eventType === 'INSERT') {
        // Add new supplier with category info
        const newSupplier = {
          ...payload.new,
          status: payload.new.is_active ? 'Active' as const : 'Inactive' as const,
          category: getCategoryName(payload.new.category_id)
        };
        
        setSuppliers(prev => [newSupplier, ...prev]);
        toast({
          title: "New Supplier",
          description: `Supplier ${payload.new.name} has been added.`,
        });
      } else if (payload.eventType === 'UPDATE') {
        // Update existing supplier
        setSuppliers(prev => 
          prev.map(supplier => 
            supplier.id === payload.new.id 
              ? {
                  ...payload.new,
                  status: payload.new.is_active ? 'Active' as const : 'Inactive' as const,
                  category: getCategoryName(payload.new.category_id)
                }
              : supplier
          )
        );
        toast({
          title: "Supplier Updated",
          description: `Supplier ${payload.new.name} has been updated.`,
        });
      } else if (payload.eventType === 'DELETE') {
        // Remove deleted supplier
        setSuppliers(prev => 
          prev.filter(supplier => supplier.id !== payload.old.id)
        );
        toast({
          title: "Supplier Deleted",
          description: `Supplier has been removed.`,
        });
      }
    } catch (error) {
      console.error('Error handling supplier realtime change:', error);
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return undefined;
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name;
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('supplier_categories')
        .select('*');

      if (error) {
        throw error;
      }

      console.log("Fetched categories:", data);
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load supplier categories.",
        variant: "destructive"
      });
    }
  };

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching suppliers with real-time support...');
      
      // First fetch the supplier categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('supplier_categories')
        .select('*');
        
      if (categoriesError) {
        throw categoriesError;
      }
      
      // Then fetch suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (suppliersError) {
        throw suppliersError;
      }

      // Create a map of category_id to category name for easier lookup
      const categoryMap = new Map();
      categoriesData?.forEach(category => {
        categoryMap.set(category.id, category.name);
      });

      // Map database results to Supplier interface with virtual status property
      const mappedSuppliers = suppliersData?.map(supplier => ({
        ...supplier,
        status: supplier.is_active ? 'Active' as const : 'Inactive' as const,
        // Use the categoryMap to get the category name based on category_id
        category: supplier.category_id && categoryMap.has(supplier.category_id) 
          ? categoryMap.get(supplier.category_id) 
          : undefined
      })) || [];

      console.log('Fetched suppliers:', mappedSuppliers.length);
      setSuppliers(mappedSuppliers);
      setCategories(categoriesData || []);
    } catch (error: any) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to load suppliers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter suppliers based on search and category
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = searchTerm === '' || 
      Object.values(supplier).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortConfig.direction === null) {
      return 0;
    }
    
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  // Handle bulk selection
  const toggleSelectAll = () => {
    if (selectedSuppliers.length === paginatedSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(paginatedSuppliers.map(supplier => supplier.id));
    }
  };

  const toggleSelectSupplier = (id: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) 
        ? prev.filter(supplierId => supplierId !== id)
        : [...prev, id]
    );
  };

  // Extract unique categories from the data
  const uniqueCategories = Array.from(new Set(suppliers.map(supplier => supplier.category).filter(Boolean)));

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    selectedSuppliers,
    setSelectedSuppliers,
    sortConfig,
    filteredSuppliers,
    sortedSuppliers,
    paginatedSuppliers,
    requestSort,
    toggleSelectAll,
    toggleSelectSupplier,
    itemsPerPage,
    totalPages,
    uniqueCategories,
    isLoading,
    refetch: fetchSuppliers,
    categories // Return the categories list
  };
};

export default useSuppliers;
