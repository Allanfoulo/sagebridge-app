
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
  category_id?: string; // From database
  balance?: number;
  created_at: string;
  is_active: boolean;
  status?: 'Active' | 'Inactive'; // Virtual property derived from is_active
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      // Map database results to Supplier interface with virtual status property
      const mappedSuppliers = data?.map(supplier => ({
        ...supplier,
        status: supplier.is_active ? 'Active' : 'Inactive',
        category: supplier.category_id // In a real app, we'd fetch category names
      })) || [];

      setSuppliers(mappedSuppliers);
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
    refetch: fetchSuppliers
  };
};

export default useSuppliers;
