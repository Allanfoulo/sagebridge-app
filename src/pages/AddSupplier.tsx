
import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const supplierFormSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  taxId: z.string().optional(),
  category: z.string(),
  paymentTerms: z.string(),
  notes: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

const AddSupplier = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      category: '',
      paymentTerms: '',
      notes: '',
    },
  });

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare data for insertion
      const supplierData = {
        name: data.companyName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        tax_id: data.taxId || null,
        payment_terms: data.paymentTerms,
        notes: data.notes || null,
        category_id: data.category !== 'other' ? data.category : null,
        is_active: true
      };
      
      // Insert data into the suppliers table
      const { data: newSupplier, error } = await supabase
        .from('suppliers')
        .insert(supplierData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Supplier Added",
        description: `${data.companyName} has been added successfully`,
      });
      
      // Navigate back to suppliers page
      navigate('/suppliers');
    } catch (error: any) {
      console.error('Error adding supplier:', error);
      toast({
        title: "Error",
        description: error.message || "Could not add supplier. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      {/* Back Button */}
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 text-sage-blue hover:text-sage-blue/90 hover:bg-sage-blue/10 flex items-center gap-2 text-sm font-medium"
          onClick={() => navigate('/suppliers')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Button>
      </div>

      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-sage-blue to-sage-blue/80 rounded-lg p-6 shadow-lg mb-6">
          <h1 className="text-2xl font-semibold text-white mb-2">Add New Supplier</h1>
          <p className="text-white/80">Enter the supplier's information below</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl mx-auto border-none shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-sage-blue mb-4">Company Information</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter company name" className="border-gray-200 focus:border-sage-blue focus:ring-sage-blue/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Contact Person</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact person name" className="border-gray-200 focus:border-sage-blue focus:ring-sage-blue/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-sage-blue mb-4">Contact Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email address" type="email" className="border-gray-200 focus:border-sage-blue focus:ring-sage-blue/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" className="border-gray-200 focus:border-sage-blue focus:ring-sage-blue/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-sage-blue mb-4">Address & Tax Information</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter complete address" className="border-gray-200 focus:border-sage-blue focus:ring-sage-blue/20 min-h-[100px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Tax ID (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tax ID" className="border-gray-200 focus:border-sage-blue focus:ring-sage-blue/20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-semibold text-sage-blue mb-4">Business Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200 focus:ring-sage-blue/20">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="raw-materials">Raw Materials</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="services">Services</SelectItem>
                              <SelectItem value="office-supplies">Office Supplies</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Payment Terms</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200 focus:ring-sage-blue/20">
                                <SelectValue placeholder="Select payment terms" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="net-30">Net 30</SelectItem>
                              <SelectItem value="net-45">Net 45</SelectItem>
                              <SelectItem value="net-60">Net 60</SelectItem>
                              <SelectItem value="immediate">Immediate</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-sage-blue mb-4">Additional Information</h2>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter any additional notes" className="border-gray-200 focus:border-sage-blue focus:ring-sage-blue/20 min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline"
                  className="border-sage-blue text-sage-blue hover:bg-sage-blue/10"
                  onClick={() => navigate('/suppliers')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-sage-blue hover:bg-sage-blue/90 text-white shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Supplier'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddSupplier;
