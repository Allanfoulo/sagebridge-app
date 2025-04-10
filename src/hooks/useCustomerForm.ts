
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { customerSchema, CustomerFormData } from '@/schemas/customerSchema';

export const useCustomerForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

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
      postalAddress: {
        line1: '',
        postalCode: '',
      },
      deliveryAddress: {
        type: 'business',
        line1: '',
        postalCode: '',
      },
      contactDetails: {
        contactName: '',
        email: '',
        telephone: '',
        mobile: '',
        canViewInvoicesOnline: false,
      },
    },
  });

  // Load customer categories
  useEffect(() => {
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
  useEffect(() => {
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
      console.log('Submitting customer data:', data);

      // Parse the credit limit to remove currency symbols and convert to a number
      let creditLimit = 0;
      try {
        creditLimit = parseFloat(data.creditLimit.replace(/[^\d.-]/g, ''));
      } catch (error) {
        console.error('Error parsing credit limit:', error);
      }

      // Parse opening balance
      let openingBalance = 0;
      try {
        openingBalance = parseFloat(data.openingBalance.replace(/[^\d.-]/g, ''));
      } catch (error) {
        console.error('Error parsing opening balance:', error);
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

      console.log('Sending to database:', customerData);

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

  return {
    form,
    date,
    setDate,
    isSubmitting,
    categories,
    copyPostalToDelivery,
    onSubmit
  };
};
