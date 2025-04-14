import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface NewInvoiceProps {
  onClose?: () => void;
  isModal?: boolean;
}

interface InvoiceFormData {
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

const EMPTY_ITEM: InvoiceItem = {
  id: '',
  description: '',
  quantity: 1,
  unit_price: 0,
  total_price: 0,
};

const PurchasesInvoiceForm: React.FC<NewInvoiceProps> = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  const [invoiceFormData, setInvoiceFormData] = useState<InvoiceFormData>({
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
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { ...EMPTY_ITEM, id: crypto.randomUUID() },
  ]);

  // Fetch suppliers when component mounts
  React.useEffect(() => {
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

  // Generate an invoice number when component mounts
  React.useEffect(() => {
    const generateInvoiceNumber = async () => {
      try {
        // Format: PI-YYYYMM-XXXX (Purchase Invoice)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        
        // Get the last invoice number to increment
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
        setInvoiceFormData(prev => ({ ...prev, invoice_number: invoiceNumber }));
      } catch (error: any) {
        console.error('Error generating invoice number:', error);
        // Fallback to a simple format
        const timestamp = Date.now();
        setInvoiceFormData(prev => ({ ...prev, invoice_number: `PI-${timestamp}` }));
      }
    };
    
    generateInvoiceNumber();
  }, []);

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

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total price if quantity or unit price changes
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total_price = updatedItem.quantity * updatedItem.unit_price;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Update invoice totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total_price, 0);
    const taxRate = 0.15; // 15% tax rate
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
    
    setInvoiceFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceFormData.supplier_id) {
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
      
      // First insert the invoice
      const { data: invoiceResponseData, error: invoiceError } = await supabase
        .from('supplier_invoices')
        .insert([
          {
            supplier_id: invoiceFormData.supplier_id,
            invoice_number: invoiceFormData.invoice_number,
            issue_date: invoiceFormData.issue_date,
            due_date: invoiceFormData.due_date,
            notes: invoiceFormData.notes,
            status: invoiceFormData.status,
            subtotal: invoiceFormData.subtotal,
            tax_amount: invoiceFormData.tax_amount,
            total_amount: invoiceFormData.total_amount,
            created_by: user?.id
          }
        ])
        .select('id')
        .single();
        
      if (invoiceError) throw invoiceError;
      
      const invoiceId = invoiceResponseData.id;
      
      // Then insert all the invoice items
      // Using individual insert operations instead of batch to avoid schema mismatch
      for (const item of items) {
        const { error: itemError } = await supabase
          .from('purchase_order_items')
          .insert({
            purchase_order_id: invoiceId, // Using purchase_order_id to store invoice_id
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isModal ? '' : 'p-6 space-y-6'}`}
    >
      {!isModal && (
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
          onClick={() => navigate('/purchases')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Purchases
        </Button>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">New Purchase Invoice</h1>
          <p className="text-muted-foreground">Create a new invoice for goods or services purchased</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select 
                    value={invoiceFormData.supplier_id} 
                    onValueChange={(value) => setInvoiceFormData({...invoiceFormData, supplier_id: value})}
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issue_date">Invoice Date</Label>
                    <Input 
                      id="issue_date" 
                      type="date" 
                      value={invoiceFormData.issue_date}
                      onChange={(e) => setInvoiceFormData({...invoiceFormData, issue_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input 
                      id="due_date" 
                      type="date" 
                      value={invoiceFormData.due_date}
                      onChange={(e) => setInvoiceFormData({...invoiceFormData, due_date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input 
                    id="invoice_number" 
                    value={invoiceFormData.invoice_number}
                    onChange={(e) => setInvoiceFormData({...invoiceFormData, invoice_number: e.target.value})}
                    className="bg-gray-50"
                    readOnly
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={invoiceFormData.status} 
                    onValueChange={(value) => setInvoiceFormData({...invoiceFormData, status: value})}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Invoice Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                      <div className="col-span-5">Description</div>
                      <div className="col-span-2">Qty</div>
                      <div className="col-span-2">Unit Price</div>
                      <div className="col-span-2">Total</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Input 
                            placeholder="Item description" 
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input 
                            type="number" 
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input 
                            value={item.total_price.toFixed(2)}
                            readOnly 
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>${invoiceFormData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (15%):</span>
                      <span>${invoiceFormData.tax_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${invoiceFormData.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Enter any additional notes"
                    value={invoiceFormData.notes}
                    onChange={(e) => setInvoiceFormData({...invoiceFormData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            type="button"
            variant="outline"
            onClick={isModal ? onClose : () => navigate('/purchases')}
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Invoice
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default PurchasesInvoiceForm;
