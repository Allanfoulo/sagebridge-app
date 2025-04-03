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
import { useToast } from '@/components/ui/use-toast';
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

const customerSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  category: z.string(),
  isCashSale: z.boolean(),
  openingBalance: z.string(),
  openingBalanceDate: z.date(),
  autoAllocateReceipts: z.boolean(),
  isActive: z.boolean(),
  creditLimit: z.string(),
  vatNumber: z.string(),
  salesRep: z.string(),
  acceptsElectronicInvoices: z.boolean(),
  postalAddress: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    line3: z.string().optional(),
    line4: z.string().optional(),
    postalCode: z.string(),
  }),
  deliveryAddress: z.object({
    type: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    line3: z.string().optional(),
    line4: z.string().optional(),
    postalCode: z.string(),
  }),
  contactDetails: z.object({
    contactName: z.string(),
    email: z.string().email('Invalid email address'),
    telephone: z.string(),
    mobile: z.string(),
    fax: z.string().optional(),
    webAddress: z.string().optional(),
    canViewInvoicesOnline: z.boolean(),
  }),
  defaultSettings: z.object({
    statementDistribution: z.string(),
    defaultDiscount: z.string(),
    defaultPriceList: z.string(),
    paymentDueDays: z.string(),
    paymentDueType: z.string(),
  }),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const AddCustomer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CustomerFormData>({
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

  const copyPostalToDelivery = () => {
    const postalAddress = watch('postalAddress');
    setValue('deliveryAddress.line1', postalAddress.line1);
    setValue('deliveryAddress.line2', postalAddress.line2 || '');
    setValue('deliveryAddress.line3', postalAddress.line3 || '');
    setValue('deliveryAddress.line4', postalAddress.line4 || '');
    setValue('deliveryAddress.postalCode', postalAddress.postalCode);
  };

  const onSubmit = async (data: CustomerFormData) => {
    try {
      // TODO: Implement customer creation logic
      console.log('Form data:', data);
      
      toast({
        title: 'Success',
        description: 'Customer has been created successfully',
        variant: 'default',
      });
      
      navigate('/customers');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create customer. Please try again.',
        variant: 'destructive',
      });
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Main Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    {...register('customerName')}
                    className={errors.customerName ? 'border-red-500' : ''}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-500">{errors.customerName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setValue('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="(None)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">(None)</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCashSale"
                    {...register('isCashSale')}
                  />
                  <Label htmlFor="isCashSale">Cash Sale Customer</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openingBalance">Opening Balance</Label>
                  <Input
                    id="openingBalance"
                    {...register('openingBalance')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Opening Balance as At</Label>
                  <Popover>
                    <PopoverTrigger asChild>
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
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoAllocateReceipts"
                    {...register('autoAllocateReceipts')}
                  />
                  <Label htmlFor="autoAllocateReceipts">Auto Allocate Receipts to Oldest Invoice</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    {...register('isActive')}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    {...register('creditLimit')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vatNumber">Customer VAT Number</Label>
                  <Input
                    id="vatNumber"
                    {...register('vatNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salesRep">Sales Rep</Label>
                  <Select onValueChange={(value) => setValue('salesRep', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="(None)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">(None)</SelectItem>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptsElectronicInvoices"
                    {...register('acceptsElectronicInvoices')}
                  />
                  <Label htmlFor="acceptsElectronicInvoices">Accepts Electronic Invoices</Label>
                </div>
              </div>

              <Separator />

              {/* Postal Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Postal Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Input {...register('postalAddress.line1')} placeholder="Address Line 1" />
                  <Input {...register('postalAddress.line2')} placeholder="Address Line 2" />
                  <Input {...register('postalAddress.line3')} placeholder="Address Line 3" />
                  <Input {...register('postalAddress.line4')} placeholder="Address Line 4" />
                  <Input {...register('postalAddress.postalCode')} placeholder="Postal Code" />
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
                <Select onValueChange={(value) => setValue('deliveryAddress.type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="pobox">PO Box</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-1 gap-4">
                  <Input {...register('deliveryAddress.line1')} placeholder="Address Line 1" />
                  <Input {...register('deliveryAddress.line2')} placeholder="Address Line 2" />
                  <Input {...register('deliveryAddress.line3')} placeholder="Address Line 3" />
                  <Input {...register('deliveryAddress.line4')} placeholder="Address Line 4" />
                  <Input {...register('deliveryAddress.postalCode')} placeholder="Postal Code" />
                </div>
              </div>

              <Separator />

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      {...register('contactDetails.contactName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('contactDetails.email')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone">Telephone</Label>
                    <Input
                      id="telephone"
                      {...register('contactDetails.telephone')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      {...register('contactDetails.mobile')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fax">Fax</Label>
                    <Input
                      id="fax"
                      {...register('contactDetails.fax')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webAddress">Web Address</Label>
                    <Input
                      id="webAddress"
                      {...register('contactDetails.webAddress')}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canViewInvoicesOnline"
                      {...register('contactDetails.canViewInvoicesOnline')}
                    />
                    <Label htmlFor="canViewInvoicesOnline">Invoices can be viewed online</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Default Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Default Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="statementDistribution">Statement Distribution</Label>
                    <Select onValueChange={(value) => setValue('defaultSettings.statementDistribution', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select distribution method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultDiscount">Default Discount</Label>
                    <Input
                      id="defaultDiscount"
                      {...register('defaultSettings.defaultDiscount')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultPriceList">Default Price List</Label>
                    <Select onValueChange={(value) => setValue('defaultSettings.defaultPriceList', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price list" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentDue">Due Date for Payment</Label>
                    <div className="flex gap-2">
                      <Input
                        id="paymentDueDays"
                        {...register('defaultSettings.paymentDueDays')}
                        className="w-24"
                      />
                      <Select onValueChange={(value) => setValue('defaultSettings.paymentDueType', value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select due date type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="end_month">End of the current Month</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
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
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Customer
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default AddCustomer; 