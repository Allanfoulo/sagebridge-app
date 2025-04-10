
import React from 'react';
import { Control } from 'react-hook-form';
import { CustomerFormData } from '@/schemas/customerSchema';
import AddressForm from './AddressForm';

interface PostalAddressSectionProps {
  control: Control<CustomerFormData>;
}

const PostalAddressSection = ({ control }: PostalAddressSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Postal Address</h3>
      <AddressForm control={control} addressPrefix="postalAddress" />
    </div>
  );
};

export default PostalAddressSection;
