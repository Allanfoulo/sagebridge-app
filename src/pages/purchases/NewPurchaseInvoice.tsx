
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PurchasesInvoiceForm from '@/components/purchases/PurchasesInvoiceForm';

const NewPurchaseInvoice: React.FC = () => {
  return (
    <MainLayout>
      <PurchasesInvoiceForm />
    </MainLayout>
  );
};

export default NewPurchaseInvoice;
