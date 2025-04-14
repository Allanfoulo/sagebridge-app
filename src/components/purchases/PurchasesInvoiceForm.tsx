
import React from 'react';
import { motion } from 'framer-motion';
import InvoiceHeader from './invoice/InvoiceHeader';
import InvoiceSupplierSection from './invoice/InvoiceSupplierSection';
import InvoiceItemsList from './invoice/InvoiceItemsList';
import InvoiceFormActions from './invoice/InvoiceFormActions';
import { usePurchaseInvoice } from './invoice/usePurchaseInvoice';

interface NewInvoiceProps {
  onClose?: () => void;
  isModal?: boolean;
}

const PurchasesInvoiceForm: React.FC<NewInvoiceProps> = ({ onClose, isModal = false }) => {
  const {
    isLoading,
    suppliers,
    formData,
    items,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleFormChange,
    handleSubmit,
    handleCancel
  } = usePurchaseInvoice(onClose, isModal);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isModal ? '' : 'p-6 space-y-6'}`}
    >
      <InvoiceHeader isModal={isModal} />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InvoiceSupplierSection 
            suppliers={suppliers}
            supplierId={formData.supplier_id}
            issueDate={formData.issue_date}
            dueDate={formData.due_date}
            invoiceNumber={formData.invoice_number}
            status={formData.status}
            onSupplierChange={(value) => handleFormChange('supplier_id', value)}
            onIssueDateChange={(value) => handleFormChange('issue_date', value)}
            onDueDateChange={(value) => handleFormChange('due_date', value)}
            onStatusChange={(value) => handleFormChange('status', value)}
          />

          <InvoiceItemsList 
            items={items}
            subtotal={formData.subtotal}
            taxAmount={formData.tax_amount}
            totalAmount={formData.total_amount}
            notes={formData.notes}
            onItemChange={handleItemChange}
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddItem}
            onNotesChange={(value) => handleFormChange('notes', value)}
          />
        </div>
        
        <InvoiceFormActions
          isLoading={isLoading}
          isModal={isModal}
          onCancel={handleCancel}
        />
      </form>
    </motion.div>
  );
};

export default PurchasesInvoiceForm;
