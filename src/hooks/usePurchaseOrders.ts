
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_name: string;
  issue_date: string;
  total_amount: number;
  status: string;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
}

export const usePurchaseOrders = () => {
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');

  useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, supplierFilter, purchaseOrders]);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          id,
          order_number,
          issue_date,
          total_amount,
          status,
          notes,
          suppliers!inner (
            name
          )
        `)
        .order('issue_date', { ascending: false });

      if (error) throw error;

      const formattedOrders = data?.map(order => ({
        id: order.id,
        order_number: order.order_number,
        supplier_name: order.suppliers.name,
        issue_date: order.issue_date,
        total_amount: order.total_amount,
        status: order.status,
        notes: order.notes
      })) || [];

      setPurchaseOrders(formattedOrders);
    } catch (error: any) {
      console.error('Error fetching purchase orders:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = purchaseOrders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by supplier
    if (supplierFilter !== 'all') {
      const selectedSupplier = suppliers.find(s => s.id === supplierFilter);
      if (selectedSupplier) {
        filtered = filtered.filter(order => 
          order.supplier_name === selectedSupplier.name
        );
      }
    }

    setFilteredOrders(filtered);
  };

  const handleApplyFilters = () => {
    filterOrders();
    toast({
      title: "Filters Applied",
      description: `Showing ${filteredOrders.length} purchase orders`,
    });
  };

  return {
    purchaseOrders,
    filteredOrders,
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    supplierFilter,
    setSupplierFilter,
    handleApplyFilters,
    refetch: fetchPurchaseOrders
  };
};
