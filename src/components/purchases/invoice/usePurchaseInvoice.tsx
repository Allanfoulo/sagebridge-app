
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { InvoiceItemType } from './InvoiceItem';

interface FormData {
  supplier_id: string;
  issue_date: string;
  due_date: string;
  invoice_number: string;
  notes: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
}

export interface Supplier {
  id: string;
  name: string;
}

export const usePurchaseInvoice = (onClose?: () => void, isModal = false) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    supplier_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    invoice_number: '',
    notes: '',
    status: 'Pending',
    subtotal: 0,
    tax_amount: 0,
    total_amount: 0,
  });
  
  const EMPTY_ITEM: InvoiceItemType = {
    id: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0,
  };
  
  const [items, setItems] = useState<InvoiceItemType[]>([
    { ...EMPTY_ITEM, id: crypto.randomUUID() },
  ]);

  useEffect(() => {
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
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load suppliers. Please try again.',
        });
      }
    };
    
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const generateInvoiceNumber = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        
        const { data, error } = await supabase
          .from('supplier_invoices')
          .select('invoice_number')
          .ilike('invoice_number', `PI-${year}${month}-%`)
          .order('invoice_number', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        let newNumber = 1;
        if (data && data.length > 0) {
          const lastNumber = data[0].invoice_number.split('-')[2];
          newNumber = parseInt(lastNumber) + 1;
        }
        
        const invoiceNumber = `PI-${year}${month}-${String(newNumber).padStart(4, '0')}`;
        setFormData(prev => ({ ...prev, invoice_number: invoiceNumber }));
      } catch (error: any) {
        console.error('Error generating invoice number:', error);
        const timestamp = Date.now();
        setFormData(prev => ({ ...prev, invoice_number: `PI-${timestamp}` }));
      }
    };
    
    generateInvoiceNumber();
  }, []);

  const handleItemChange = (id: string, field: keyof InvoiceItemType, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total_price = updatedItem.quantity * updatedItem.unit_price;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
    
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0);
    const taxRate = 0.15;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount
    }));
  };

  const handleAddItem = () => {
    setItems([...items, { ...EMPTY_ITEM, id: crypto.randomUUID() }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast({
        title: 'Cannot remove item',
        description: 'Invoice must have at least one item',
      });
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const handleFormChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier_id) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select a supplier',
      });
      return;
    }
    
    if (items.some(item => !item.description.trim())) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'All items must have a description',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data: newInvoice, error: invoiceError } = await supabase
        .from('supplier_invoices')
        .insert([
          {
            supplier_id: formData.supplier_id,
            invoice_number: formData.invoice_number,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            notes: formData.notes,
            status: formData.status,
            subtotal: formData.subtotal,
            tax_amount: formData.tax_amount,
            total_amount: formData.total_amount,
            created_by: user?.id
          }
        ])
        .select('id')
        .single();
        
      if (invoiceError) throw invoiceError;
      
      for (const item of items) {
        const { error: itemError } = await supabase
          .from('purchase_order_items')
          .insert({
            purchase_order_id: newInvoice.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price
          });
          
        if (itemError) throw itemError;
      }
      
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      });
      
      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/purchases');
      }
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create invoice',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate('/purchases');
    }
  };

  return {
    isLoading,
    suppliers,
    formData,
    items,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleFormChange,
    handleSubmit,
    handleCancel
  };
};
