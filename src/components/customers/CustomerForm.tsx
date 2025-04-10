
import React from 'react';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { CustomerFormData } from '@/schemas/customerSchema';
import { UseFormReturn } from 'react-hook-form';
import CustomerMainInfo from './CustomerMainInfo';
import PostalAddressSection from './PostalAddressSection';
import DeliveryAddressSection from './DeliveryAddressSection';
import ContactDetailsSection from './ContactDetailsSection';
import DefaultSettingsSection from './DefaultSettingsSection';
import CustomerFormActions from './CustomerFormActions';

interface CustomerFormProps {
  form: UseFormReturn<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  isSubmitting: boolean;
  categories: { id: string; name: string }[];
  copyPostalToDelivery: () => void;
  isEditing?: boolean;
}

const CustomerForm = ({
  form,
  onSubmit,
  date,
  setDate,
  isSubmitting,
  categories,
  copyPostalToDelivery,
  isEditing = false
}: CustomerFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Main Information */}
        <CustomerMainInfo 
          control={form.control} 
          date={date} 
          setDate={setDate} 
          categories={categories} 
        />

        <Separator />

        {/* Postal Address */}
        <PostalAddressSection control={form.control} />

        <Separator />

        {/* Delivery Address */}
        <DeliveryAddressSection 
          control={form.control} 
          watch={form.watch} 
          copyPostalToDelivery={copyPostalToDelivery} 
        />

        <Separator />

        {/* Contact Details */}
        <ContactDetailsSection control={form.control} />

        <Separator />

        {/* Default Settings */}
        <DefaultSettingsSection control={form.control} />

        {/* Submit Buttons */}
        <CustomerFormActions isSubmitting={isSubmitting} isEditing={isEditing} />
      </form>
    </Form>
  );
};

export default CustomerForm;
