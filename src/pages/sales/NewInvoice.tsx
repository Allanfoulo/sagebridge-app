import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Trash2, Save, FileText, Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';
import { saveInvoice, availableCurrencies, getCurrencySymbol } from '@/utils/salesInvoiceService';
import { supabase } from '@/integrations/supabase/client';

interface Customer {
  id: string;
  name: string;
}

const formSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  notes: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  items: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      unitPrice: z.number().min(0, "Price cannot be negative"),
      tax: z.number().min(0, "Tax cannot be negative"),
      total: z.number(),
    })
  ).min(1, "At least one item is required"),
});

type FormValues = z.infer<typeof formSchema>;

const NewInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = format(new Date(), 'yyyy-MM-dd');
  const thirtyDaysLater = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        
        setCustomers(data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load customers. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      invoiceDate: today,
      dueDate: thirtyDaysLater,
      invoiceNumber: `INV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      paymentTerms: 'Net 30',
      notes: '',
      currency: 'ZAR', // Default to South African Rand
      items: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          tax: 0,
          total: 0,
        },
      ],
    },
  });

  const selectedCurrency = form.watch('currency');
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const items = form.watch('items') || [];
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.tax / 100), 0);
  const grandTotal = subtotal + taxTotal;

  const addItem = () => {
    const currentItems = form.getValues('items');
    form.setValue('items', [
      ...currentItems,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items');
    if (currentItems.length > 1) {
      form.setValue('items', currentItems.filter((_, i) => i !== index));
    } else {
      toast({
        variant: "destructive",
        title: "Cannot Remove Item",
        description: "An invoice must have at least one item.",
      });
    }
  };

  const updateItemTotal = (index: number) => {
    const currentItems = form.getValues('items');
    const item = currentItems[index];
    const total = item.quantity * item.unitPrice;
    
    currentItems[index] = {
      ...item,
      total,
    };
    
    form.setValue('items', currentItems);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const invoiceData = {
        customer: data.customer,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        invoiceNumber: data.invoiceNumber,
        paymentTerms: data.paymentTerms,
        notes: data.notes || '',
        currency: data.currency,
        items: data.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          tax: item.tax,
          total: item.quantity * item.unitPrice
        }))
      };
      
      const result = await saveInvoice(invoiceData);
      
      if (result.success) {
        toast({
          title: "Invoice Created",
          description: "Invoice has been successfully created and saved.",
        });
        
        setTimeout(() => navigate('/sales'), 1500);
      } else {
        toast({
          variant: "destructive",
          title: "Error Saving Invoice",
          description: "There was a problem saving the invoice. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast({
        variant: "destructive",
        title: "Error Saving Invoice",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <motion.div
        className="space-y-6 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => navigate('/sales')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sales
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Create New Invoice</h1>
              <p className="text-muted-foreground">Create a new invoice for a customer</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/sales')}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button 
                className="gap-2" 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Invoice'}
              </Button>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="mb-4">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            {availableCurrencies.map(currency => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.symbol} - {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Invoice Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FormField
                      control={form.control}
                      name="customer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a customer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {loading ? (
                                <SelectItem disabled value="">Loading customers...</SelectItem>
                              ) : customers.length > 0 ? (
                                customers.map(customer => (
                                  <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled value="">No customers found</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormField
                      control={form.control}
                      name="invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                            <SelectItem value="Net 7">Net 7</SelectItem>
                            <SelectItem value="Net 15">Net 15</SelectItem>
                            <SelectItem value="Net 30">Net 30</SelectItem>
                            <SelectItem value="Net 60">Net 60</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Invoice Items</CardTitle>
                <Button 
                  type="button" 
                  onClick={addItem} 
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Item
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 font-medium text-sm text-muted-foreground py-2 border-b">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-1 text-center">Tax %</div>
                    <div className="col-span-1 text-center">Total</div>
                    <div className="col-span-1 text-center"></div>
                  </div>
                  
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <Input 
                          placeholder="Item description"
                          {...form.register(`items.${index}.description`)}
                          className="bg-white"
                        />
                      </div>
                      <div className="col-span-1">
                        <Input 
                          type="number"
                          min="1"
                          {...form.register(`items.${index}.quantity`, { 
                            valueAsNumber: true,
                            onChange: () => updateItemTotal(index)
                          })}
                          className="text-center bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          {...form.register(`items.${index}.unitPrice`, { 
                            valueAsNumber: true,
                            onChange: () => updateItemTotal(index)
                          })}
                          className="text-center bg-white"
                        />
                      </div>
                      <div className="col-span-1">
                        <Input 
                          type="number"
                          min="0"
                          max="100"
                          {...form.register(`items.${index}.tax`, { 
                            valueAsNumber: true,
                            onChange: () => updateItemTotal(index)
                          })}
                          className="text-center bg-white"
                        />
                      </div>
                      <div className="col-span-1 text-center font-medium">
                        {currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}
                      </div>
                      <div className="col-span-1 text-center">
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t mt-6">
                    <div className="flex justify-end space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4 w-1/3">
                        <div className="text-right">Subtotal:</div>
                        <div className="text-right font-medium">{currencySymbol}{subtotal.toFixed(2)}</div>
                        
                        <div className="text-right">Tax:</div>
                        <div className="text-right font-medium">{currencySymbol}{taxTotal.toFixed(2)}</div>
                        
                        <div className="text-right font-medium">Total:</div>
                        <div className="text-right font-bold">{currencySymbol}{grandTotal.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter notes or additional information for the customer"
                          className="min-h-32 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/sales')}
              >
                Cancel
              </Button>
              
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    toast({
                      title: "Preview",
                      description: "Invoice preview functionality is coming soon.",
                    });
                  }}
                >
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    toast({
                      title: "Send Email",
                      description: "Email functionality is coming soon.",
                    });
                  }}
                >
                  <Send className="h-4 w-4" />
                  Email Invoice
                </Button>
                
                <Button 
                  type="submit"
                  className="gap-2"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Invoice'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </MainLayout>
  );
};

export default NewInvoice;
