
import React, { useState } from 'react';
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

// Sample customers data
const customers = [
  { id: '1', name: 'Acme Corp' },
  { id: '2', name: 'Globex Inc' },
  { id: '3', name: 'Stark Industries' },
  { id: '4', name: 'Wayne Enterprises' },
  { id: '5', name: 'Umbrella Corp' },
];

// Define the form schema with Zod
const formSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  quoteDate: z.string().min(1, "Quote date is required"),
  validUntil: z.string().min(1, "Validity date is required"),
  terms: z.string().optional(),
  notes: z.string().optional(),
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

const NewQuote: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = format(new Date(), 'yyyy-MM-dd');
  const thirtyDaysLater = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      quoteDate: today,
      validUntil: thirtyDaysLater,
      terms: 'Net 30',
      notes: '',
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

  // Calculate subtotal, tax total, and grand total
  const items = form.watch('items') || [];
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.tax / 100), 0);
  const grandTotal = subtotal + taxTotal;

  // Add a new item to the quote
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

  // Remove an item from the quote
  const removeItem = (index: number) => {
    const currentItems = form.getValues('items');
    if (currentItems.length > 1) {
      form.setValue('items', currentItems.filter((_, i) => i !== index));
    } else {
      toast({
        variant: "destructive",
        title: "Cannot Remove Item",
        description: "A quote must have at least one item.",
      });
    }
  };

  // Update item total when quantity or price changes
  const updateItemTotal = (index: number) => {
    const currentItems = form.getValues('items');
    const item = currentItems[index];
    const total = item.quantity * item.unitPrice;
    
    // Update the item's total
    currentItems[index] = {
      ...item,
      total,
    };
    
    form.setValue('items', currentItems);
  };

  // Form submission
  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    
    toast({
      title: "Quote Created",
      description: "Quote has been successfully created and saved.",
    });
    
    // Navigate back to sales page after successful submission
    setTimeout(() => navigate('/sales'), 1500);
  };

  return (
    <MainLayout>
      <motion.div
        className="space-y-6 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back Button & Header */}
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
              <h1 className="text-2xl font-bold tracking-tight">Create New Quote</h1>
              <p className="text-muted-foreground">Create a new quote for a customer</p>
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
              >
                <Save className="h-4 w-4" />
                Save Quote
              </Button>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Quote Info Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Quote Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-4">
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
                            {customers.map(customer => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="quoteDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valid Until</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Quote Items Card */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Quote Items</CardTitle>
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
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-2 font-medium text-sm text-muted-foreground py-2 border-b">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-1 text-center">Tax %</div>
                    <div className="col-span-1 text-center">Total</div>
                    <div className="col-span-1 text-center"></div>
                  </div>
                  
                  {/* Item Rows */}
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
                        {(item.quantity * item.unitPrice).toFixed(2)}
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
                  
                  {/* Totals */}
                  <div className="pt-4 border-t mt-6">
                    <div className="flex justify-end space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4 w-1/3">
                        <div className="text-right">Subtotal:</div>
                        <div className="text-right font-medium">${subtotal.toFixed(2)}</div>
                        
                        <div className="text-right">Tax:</div>
                        <div className="text-right font-medium">${taxTotal.toFixed(2)}</div>
                        
                        <div className="text-right font-medium">Total:</div>
                        <div className="text-right font-bold">${grandTotal.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Terms & Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Terms & Notes</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter payment terms and conditions"
                          className="min-h-32 bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter additional notes for the customer"
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
            
            {/* Action Buttons */}
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
                    // Preview functionality would go here
                    toast({
                      title: "Preview",
                      description: "Quote preview functionality is coming soon.",
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
                    // Email functionality would go here
                    toast({
                      title: "Send Email",
                      description: "Email functionality is coming soon.",
                    });
                  }}
                >
                  <Send className="h-4 w-4" />
                  Email Quote
                </Button>
                
                <Button 
                  type="submit"
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Quote
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </MainLayout>
  );
};

export default NewQuote;
