
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { CustomerFormData } from '@/schemas/customerSchema';

interface AddressFormProps {
  control: Control<CustomerFormData>;
  addressPrefix: 'postalAddress' | 'deliveryAddress';
}

const AddressForm = ({ control, addressPrefix }: AddressFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name={`${addressPrefix}.line1`}
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
        control={control}
        name={`${addressPrefix}.line2`}
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
        control={control}
        name={`${addressPrefix}.line3`}
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
        control={control}
        name={`${addressPrefix}.line4`}
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
        control={control}
        name={`${addressPrefix}.postalCode`}
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
  );
};

export default AddressForm;
