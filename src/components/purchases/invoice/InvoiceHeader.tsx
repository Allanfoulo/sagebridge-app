
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvoiceHeaderProps {
  isModal?: boolean;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ isModal }) => {
  const navigate = useNavigate();
  
  if (isModal) return null;
  
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
        onClick={() => navigate('/purchases')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Purchases
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">New Purchase Invoice</h1>
          <p className="text-muted-foreground">Create a new invoice for goods or services purchased</p>
        </div>
      </div>
    </>
  );
};

export default InvoiceHeader;
