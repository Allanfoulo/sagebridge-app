
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupplierInvoice {
  id: string;
  invoice_number: string;
  supplier_name: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: string;
  notes?: string;
}

export const useSupplierInvoices = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<SupplierInvoice[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
    fetchSuppliers();
    setupRealtimeSubscription();

    // Cleanup function to remove subscription
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  const setupRealtimeSubscription = () => {
    console.log('Setting up real-time subscription for supplier invoices');
    
    const channel = supabase
      .channel('supplier-invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'supplier_invoices'
        },
        (payload) => {
          console.log('Supplier invoice change detected:', payload);
          handleRealtimeChange(payload);
        }
      )
      .subscribe((status) => {
        console.log('Supplier invoices subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to supplier invoices changes');
        }
      });

    return channel;
  };

  const handleRealtimeChange = async (payload: any) => {
    console.log('Handling supplier invoice realtime change:', payload.eventType);
    
    try {
      if (payload.eventType === 'INSERT') {
        // Fetch the new invoice with supplier info
        const { data, error } = await supabase
          .from('supplier_invoices')
          .select(`
            id,
            invoice_number,
            issue_date,
            due_date,
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
          const newInvoice = {
            id: data.id,
            invoice_number: data.invoice_number,
            supplier_name: data.suppliers.name,
            issue_date: data.issue_date,
            due_date: data.due_date,
            total_amount: data.total_amount,
            status: data.status,
            notes: data.notes
          };
          
          setInvoices(prev => [newInvoice, ...prev]);
          toast({
            title: "New Invoice",
            description: `Invoice ${data.invoice_number} has been added.`,
          });
        }
      } else if (payload.eventType === 'UPDATE') {
        // Update existing invoice
        setInvoices(prev => 
          prev.map(invoice => 
            invoice.id === payload.new.id 
              ? { ...invoice, ...payload.new, supplier_name: invoice.supplier_name }
              : invoice
          )
        );
        toast({
          title: "Invoice Updated",
          description: `Invoice ${payload.new.invoice_number} has been updated.`,
        });
      } else if (payload.eventType === 'DELETE') {
        // Remove deleted invoice
        setInvoices(prev => 
          prev.filter(invoice => invoice.id !== payload.old.id)
        );
        toast({
          title: "Invoice Deleted",
          description: `Invoice has been removed.`,
        });
      }
    } catch (error) {
      console.error('Error handling supplier invoice realtime change:', error);
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

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching supplier invoices with real-time support...');
      
      const { data, error } = await supabase
        .from('supplier_invoices')
        .select(`
          id,
          invoice_number,
          issue_date,
          due_date,
          total_amount,
          status,
          notes,
          suppliers!inner (
            name
          )
        `)
        .order('issue_date', { ascending: false });

      if (error) throw error;

      const formattedInvoices = data?.map(invoice => ({
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        supplier_name: invoice.suppliers.name,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        total_amount: invoice.total_amount,
        status: invoice.status,
        notes: invoice.notes
      })) || [];

      console.log('Fetched supplier invoices:', formattedInvoices.length);
      setInvoices(formattedInvoices);
    } catch (error: any) {
      console.error('Error fetching supplier invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load supplier invoices. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter invoices based on search and filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      Object.values(invoice).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || 
      invoice.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesSupplier = supplierFilter === 'all' || 
      suppliers.find(s => s.id === supplierFilter)?.name === invoice.supplier_name;
    
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  // Calculate statistics
  const stats = {
    totalOutstanding: filteredInvoices
      .filter(i => i.status.toLowerCase() !== 'paid')
      .reduce((sum, i) => sum + i.total_amount, 0),
    overdue: filteredInvoices
      .filter(i => i.status.toLowerCase() === 'overdue')
      .reduce((sum, i) => sum + i.total_amount, 0),
    paidThisMonth: filteredInvoices
      .filter(i => i.status.toLowerCase() === 'paid')
      .reduce((sum, i) => sum + i.total_amount, 0),
    overdueCount: filteredInvoices.filter(i => i.status.toLowerCase() === 'overdue').length,
    pendingCount: filteredInvoices.filter(i => i.status.toLowerCase() === 'pending').length,
    paidCount: filteredInvoices.filter(i => i.status.toLowerCase() === 'paid').length
  };

  return {
    invoices: filteredInvoices,
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    supplierFilter,
    setSupplierFilter,
    stats,
    refetch: fetchInvoices
  };
};
