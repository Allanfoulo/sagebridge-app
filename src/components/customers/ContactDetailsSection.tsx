
import React from 'react';
import { Control } from 'react-hook-form';
import { CustomerFormData } from '@/schemas/customerSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface ContactDetailsSectionProps {
  control: Control<CustomerFormData>;
}

const ContactDetailsSection = ({ control }: ContactDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
};

export default ContactDetailsSection;
