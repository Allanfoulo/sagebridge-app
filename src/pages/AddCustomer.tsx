
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

const customerSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  category: z.string(),
  isCashSale: z.boolean().default(false),
  openingBalance: z.string(),
  openingBalanceDate: z.date().optional(),
  autoAllocateReceipts: z.boolean().default(false),
  isActive: z.boolean().default(true),
  creditLimit: z.string(),
  vatNumber: z.string().optional(),
  salesRep: z.string().optional(),
  acceptsElectronicInvoices: z.boolean().default(false),
  postalAddress: z.object({
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    line3: z.string().optional(),
    line4: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  deliveryAddress: z.object({
    type: z.string(),
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    line3: z.string().optional(),
    line4: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  contactDetails: z.object({
    contactName: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email address'),
    telephone: z.string().min(1, 'Telephone number is required'),
    mobile: z.string().min(1, 'Mobile number is required'),
    fax: z.string().optional(),
    webAddress: z.string().optional(),
    canViewInvoicesOnline: z.boolean().default(false),
  }),
  defaultSettings: z.object({
    statementDistribution: z.string().optional(),
    defaultDiscount: z.string(),
    defaultPriceList: z.string().optional(),
    paymentDueDays: z.string().optional(),
    paymentDueType: z.string(),
  }),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const AddCustomer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([]);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      isActive: true,
      isCashSale: false,
      autoAllocateReceipts: false,
      acceptsElectronicInvoices: false,
      openingBalance: 'R0.00',
      creditLimit: 'R0.00',
      defaultSettings: {
        defaultDiscount: '0.00%',
        paymentDueType: 'End of the current Month',
      },
    },
  });

  // Load customer categories
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('customer_categories')
          .select('id, name');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setCategories(data);
        }
      } catch (error: any) {
        console.error('Error fetching customer categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Set opening balance date when date changes
  React.useEffect(() => {
    if (date) {
      form.setValue('openingBalanceDate', date);
    }
  }, [date, form]);

  const copyPostalToDelivery = () => {
    const postalAddress = form.watch('postalAddress');
    form.setValue('deliveryAddress.line1', postalAddress.line1);
    form.setValue('deliveryAddress.line2', postalAddress.line2 || '');
    form.setValue('deliveryAddress.line3', postalAddress.line3 || '');
    form.setValue('deliveryAddress.line4', postalAddress.line4 || '');
    form.setValue('deliveryAddress.postalCode', postalAddress.postalCode);
  };

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setIsSubmitting(true);

      // Parse the credit limit to remove currency symbols and convert to a number
      let creditLimit = 0;
      try {
        creditLimit = parseFloat(data.creditLimit.replace(/[^\d.-]/g, ''));
      } catch (error) {
        console.error('Error parsing credit limit:', error);
      }

      // Prepare customer data for the database
      const customerData = {
        name: data.customerName,
        email: data.contactDetails.email,
        phone: data.contactDetails.telephone,
        address: data.postalAddress.line1 + 
                (data.postalAddress.line2 ? ', ' + data.postalAddress.line2 : '') +
                (data.postalAddress.line3 ? ', ' + data.postalAddress.line3 : '') + 
                (data.postalAddress.line4 ? ', ' + data.postalAddress.line4 : ''),
        city: data.postalAddress.line3 || null,
        state: data.postalAddress.line2 || null,
        zip_code: data.postalAddress.postalCode,
        country: data.postalAddress.line4 || null,
        tax_id: data.vatNumber || null,
        category_id: data.category !== 'none' ? data.category : null,
        notes: `Contact: ${data.contactDetails.contactName}, Mobile: ${data.contactDetails.mobile}`,
        website: data.contactDetails.webAddress || null,
        is_active: data.isActive,
        credit_limit: creditLimit
      };

      // Insert data into the customers table
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Customer has been created successfully',
        variant: 'default',
      });
      
      navigate('/customers');
    } catch (error: any) {
      console.error('Error creating customer:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create customer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
          onClick={() => navigate('/customers')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Button>
      </div>

      {/* Header Section */}
      <div className="bg-blue-600 rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-white mb-2">New Customer</h1>
        <p className="text-white/80">Create a new customer record</p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-gray-50">
            <TabsTrigger value="details" className="rounded-none data-[state=active]:bg-white">Details</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-none data-[state=active]:bg-white">Activity</TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-none data-[state=active]:bg-white">Additional Contacts</TabsTrigger>
            <TabsTrigger value="notes" className="rounded-none data-[state=active]:bg-white">Notes</TabsTrigger>
            <TabsTrigger value="fields" className="rounded-none data-[state=active]:bg-white">User Defined Fields</TabsTrigger>
            <TabsTrigger value="personal" className="rounded-none data-[state=active]:bg-white">Personal Information</TabsTrigger>
            <TabsTrigger value="sales" className="rounded-none data-[state=active]:bg-white">Sales Graph</TabsTrigger>
            <TabsTrigger value="quotes" className="rounded-none data-[state=active]:bg-white">Quotes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Main Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="(None)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">(None)</SelectItem>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isCashSale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Cash Sale Customer</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openingBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Balance</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openingBalanceDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Opening Balance as At</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="autoAllocateReceipts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Auto Allocate Receipts to Oldest Invoice</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Active</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="creditLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Limit</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vatNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer VAT Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salesRep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Rep</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="(None)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">(None)</SelectItem>
                            <SelectItem value="john">John Doe</SelectItem>
                            <SelectItem value="jane">Jane Smith</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptsElectronicInvoices"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Accepts Electronic Invoices</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Postal Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Postal Address</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="postalAddress.line1"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Address Line 1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalAddress.line2"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Address Line 2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalAddress.line3"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Address Line 3" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalAddress.line4"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Address Line 4" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalAddress.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Postal Code" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Delivery Address */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Delivery Address</h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyPostalToDelivery}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy from Postal Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                      >
                        <Map className="h-4 w-4 mr-2" />
                        Map
                      </Button>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="deliveryAddress.type"
                    render={({ field }) => (
                      <FormItem>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select address type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="pobox">PO Box</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="deliveryAddress.line1"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Address Line 1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryAddress.line2"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Address Line 2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryAddress.line3"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Address Line 3" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryAddress.line4"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Address Line 4" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryAddress.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Postal Code" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactDetails.contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactDetails.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactDetails.telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactDetails.mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactDetails.fax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fax</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactDetails.webAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Web Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactDetails.canViewInvoicesOnline"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Invoices can be viewed online</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Default Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Default Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="defaultSettings.statementDistribution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statement Distribution</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select distribution method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="post">Post</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="defaultSettings.defaultDiscount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Discount</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="defaultSettings.defaultPriceList"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Price List</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select price list" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="wholesale">Wholesale</SelectItem>
                              <SelectItem value="special">Special</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Due Date for Payment</FormLabel>
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="defaultSettings.paymentDueDays"
                          render={({ field }) => (
                            <FormItem className="w-24">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="defaultSettings.paymentDueType"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select due date type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="end_month">End of the current Month</SelectItem>
                                  <SelectItem value="days">Days</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/customers')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Customer'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default AddCustomer;
