
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface InvoiceFormActionsProps {
  isLoading: boolean;
  isModal?: boolean;
  onCancel: () => void;
}

const InvoiceFormActions: React.FC<InvoiceFormActionsProps> = ({
  isLoading,
  isModal,
  onCancel
}) => {
  return (
    <div className="flex justify-end gap-3">
      <Button 
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        <X className="h-4 w-4 mr-2" /> Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>Saving...</>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" /> Save Invoice
          </>
        )}
      </Button>
    </div>
  );
};

export default InvoiceFormActions;
