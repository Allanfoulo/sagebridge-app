
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useCustomerForm } from '@/hooks/useCustomerForm';
import CustomerForm from '@/components/customers/CustomerForm';

const AddCustomer = () => {
  const navigate = useNavigate();
  const {
    form,
    date,
    setDate,
    isSubmitting,
    categories,
    copyPostalToDelivery,
    onSubmit
  } = useCustomerForm();

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
            <CustomerForm
              form={form}
              onSubmit={onSubmit}
              date={date}
              setDate={setDate}
              isSubmitting={isSubmitting}
              categories={categories}
              copyPostalToDelivery={copyPostalToDelivery}
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default AddCustomer;
