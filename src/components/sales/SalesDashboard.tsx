
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SalesDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const navigateToNewInvoice = () => {
    navigate('/sales/new-invoice');
  };

  const navigateToNewQuote = () => {
    navigate('/sales/new-quote');
  };

  const navigateToCustomers = () => {
    navigate('/customers');
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Sales Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={navigateToNewInvoice} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          <FilePlus size={16} className="mr-2" />
          New Invoice
        </Button>
        <Button 
          onClick={navigateToNewQuote}
          variant="outline" 
          className="w-full"
        >
          <FilePlus size={16} className="mr-2" />
          New Quote
        </Button>
        <Button 
          onClick={navigateToCustomers}
          variant="outline" 
          className="w-full"
        >
          <Users size={16} className="mr-2" />
          Customer Database
        </Button>
        
        <div className="pt-4 border-t border-sage-lightGray">
          <h4 className="font-medium text-sm mb-3">Quick Filters</h4>
          <div className="space-y-2">
            <button className="bg-sage-lightGray hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left">
              All Invoices
            </button>
            <button className="hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left">
              Paid
            </button>
            <button className="hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left">
              Unpaid
            </button>
            <button className="hover:bg-primary-50 text-sage-darkGray w-full py-2 px-4 rounded-md text-sm transition-colors text-left">
              Overdue
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesDashboard;
