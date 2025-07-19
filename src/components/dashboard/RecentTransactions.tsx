
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownUp, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import InvoiceReport from '@/components/sales/InvoiceReport';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: string;
  type: 'income' | 'expense';
  invoiceId?: string; // Add invoice ID for clickable transactions
}

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      setIsLoading(true);

      // Fetch recent sales invoices (income)
      const { data: salesInvoices, error: salesError } = await supabase
        .from('sales_invoices')
        .select(`
          id,
          issue_date,
          total_amount,
          customers(name)
        `)
        .order('issue_date', { ascending: false })
        .limit(3);

      if (salesError) throw salesError;

      // Fetch recent supplier invoices (expenses)
      const { data: supplierInvoices, error: supplierError } = await supabase
        .from('supplier_invoices')
        .select(`
          id,
          issue_date,
          total_amount,
          suppliers(name)
        `)
        .order('issue_date', { ascending: false })
        .limit(3);

      if (supplierError) throw supplierError;

      // Combine and format transactions
      const combinedTransactions: Transaction[] = [];

      // Add sales invoices as income
      salesInvoices?.forEach(invoice => {
        combinedTransactions.push({
          id: `sales-${invoice.id}`,
          date: invoice.issue_date,
          description: `Invoice - ${invoice.customers?.name || 'Unknown Customer'}`,
          category: 'Sales',
          amount: `+R${Number(invoice.total_amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
          type: 'income',
          invoiceId: invoice.id // Store the actual invoice ID for navigation
        });
      });

      // Add supplier invoices as expenses
      supplierInvoices?.forEach(invoice => {
        combinedTransactions.push({
          id: `supplier-${invoice.id}`,
          date: invoice.issue_date,
          description: `Purchase - ${invoice.suppliers?.name || 'Unknown Supplier'}`,
          category: 'Purchases',
          amount: `-R${Number(invoice.total_amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
          type: 'expense'
          // No invoiceId for supplier invoices as we don't have that report component yet
        });
      });

      // Sort by date and take the 5 most recent
      combinedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(combinedTransactions.slice(0, 5));

    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load recent transactions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    if (transaction.type === 'income' && transaction.invoiceId) {
      setSelectedInvoiceId(transaction.invoiceId);
    }
  };

  const handleCloseInvoice = () => {
    setSelectedInvoiceId(null);
  };
  
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Loading transactions...</p>
        </CardHeader>
        <CardContent className="py-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-0 flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Latest financial activities</p>
          </div>
          <button className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors inline-flex items-center">
            View All <ChevronRight size={14} className="ml-1" />
          </button>
        </CardHeader>
        <CardContent className="py-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ArrowDownUp size={48} className="mx-auto mb-4 opacity-50" />
              <p>No recent transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-colors",
                    transaction.type === 'income' && transaction.invoiceId 
                      ? "hover:bg-sage-lightGray cursor-pointer" 
                      : "hover:bg-sage-lightGray"
                  )}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      transaction.type === 'income' ? "bg-green-100" : "bg-red-100"
                    )}>
                      <ArrowDownUp 
                        size={16} 
                        className={transaction.type === 'income' ? "text-green-600" : "text-red-600"} 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date} • {transaction.category}
                        {transaction.type === 'income' && transaction.invoiceId && (
                          <span className="ml-2 text-primary-500">• Click to view</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "font-medium",
                    transaction.type === 'income' ? "text-green-600" : "text-red-600"
                  )}>
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Report Modal */}
      {selectedInvoiceId && (
        <InvoiceReport
          invoiceId={selectedInvoiceId}
          onClose={handleCloseInvoice}
        />
      )}
    </>
  );
};

export default RecentTransactions;
