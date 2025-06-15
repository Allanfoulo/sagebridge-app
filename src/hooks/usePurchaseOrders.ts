
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
    setupRealtimeSubscription();

    // Cleanup function to remove subscription
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, supplierFilter, purchaseOrders]);

  const setupRealtimeSubscription = () => {
    console.log('Setting up real-time subscription for purchase orders');
    
    const channel = supabase
      .channel('purchase-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_orders'
        },
        (payload) => {
          console.log('Purchase order change detected:', payload);
          handleRealtimeChange(payload);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to purchase orders changes');
        }
      });

    return channel;
  };

  const handleRealtimeChange = async (payload: any) => {
    console.log('Handling realtime change:', payload.eventType);
    
    try {
      if (payload.eventType === 'INSERT') {
        // Fetch the new purchase order with supplier info
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
          .eq('id', payload.new.id)
          .single();

        if (!error && data) {
          const newOrder = {
            id: data.id,
            order_number: data.order_number,
            supplier_name: data.suppliers.name,
            issue_date: data.issue_date,
            total_amount: data.total_amount,
            status: data.status,
            notes: data.notes
          };
          
          setPurchaseOrders(prev => [newOrder, ...prev]);
          toast({
            title: "New Purchase Order",
            description: `Purchase order ${data.order_number} has been created.`,
          });
        }
      } else if (payload.eventType === 'UPDATE') {
        // Update existing purchase order
        setPurchaseOrders(prev => 
          prev.map(order => 
            order.id === payload.new.id 
              ? { ...order, ...payload.new, supplier_name: order.supplier_name }
              : order
          )
        );
        toast({
          title: "Purchase Order Updated",
          description: `Purchase order has been updated.`,
        });
      } else if (payload.eventType === 'DELETE') {
        // Remove deleted purchase order
        setPurchaseOrders(prev => 
          prev.filter(order => order.id !== payload.old.id)
        );
        toast({
          title: "Purchase Order Deleted",
          description: `Purchase order has been removed.`,
        });
      }
    } catch (error) {
      console.error('Error handling realtime change:', error);
    }
  };

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
      console.log('Fetching purchase orders...');
      
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

      console.log('Fetched purchase orders:', formattedOrders.length);
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
