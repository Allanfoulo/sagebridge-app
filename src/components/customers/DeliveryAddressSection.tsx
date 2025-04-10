
import React from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import { CustomerFormData } from '@/schemas/customerSchema';
import { Button } from '@/components/ui/button';
import { Copy, Map } from 'lucide-react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddressForm from './AddressForm';

interface DeliveryAddressSectionProps {
  control: Control<CustomerFormData>;
  watch: UseFormWatch<CustomerFormData>;
  copyPostalToDelivery: () => void;
}

const DeliveryAddressSection = ({ control, watch, copyPostalToDelivery }: DeliveryAddressSectionProps) => {
  return (
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
        control={control}
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
      <AddressForm control={control} addressPrefix="deliveryAddress" />
    </div>
  );
};

export default DeliveryAddressSection;
