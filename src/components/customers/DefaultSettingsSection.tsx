
import React from 'react';
import { Control } from 'react-hook-form';
import { CustomerFormData } from '@/schemas/customerSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DefaultSettingsSectionProps {
  control: Control<CustomerFormData>;
}

const DefaultSettingsSection = ({ control }: DefaultSettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Default Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
              control={control}
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
              control={control}
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
  );
};

export default DefaultSettingsSection;
