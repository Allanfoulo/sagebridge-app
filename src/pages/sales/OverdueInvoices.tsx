
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { fetchFilteredInvoices } from '@/utils/salesInvoiceService';

// Import our components
import SalesHeader from '@/components/sales/SalesHeader';
import SalesDashboard from '@/components/sales/SalesDashboard';
import InvoiceListHeader from '@/components/sales/InvoiceListHeader';
import InvoiceTable from '@/components/sales/InvoiceTable';
import { useSalesExport } from '@/components/sales/SalesExportUtils';

const OverdueInvoices: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get export utilities
  const { exportToCSV, exportToExcel, handleImport } = useSalesExport();
  
  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const result = await fetchFilteredInvoices('Overdue');
      if (result.success) {
        setInvoices(result.invoices);
      } else {
        console.error("Error fetching invoices:", result.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load invoices. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [toast]);

  const filteredInvoices = invoices.filter(
    invoice => 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Wrapper functions to pass filtered invoices to export functions
  const handleExportToCSV = () => exportToCSV(filteredInvoices);
  const handleExportToExcel = () => exportToExcel(filteredInvoices);

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SalesHeader 
          exportToCSV={handleExportToCSV} 
          exportToExcel={handleExportToExcel} 
          handleImport={handleImport} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <SalesDashboard />
          
          <Card className="md:col-span-3">
            <CardHeader className="pb-0">
              <InvoiceListHeader 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
                title="Overdue Invoices"
              />
            </CardHeader>
            <CardContent>
              <InvoiceTable 
                invoices={invoices} 
                filteredInvoices={filteredInvoices} 
                isLoading={isLoading} 
                searchQuery={searchQuery} 
                onStatusUpdate={loadInvoices}
              />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default OverdueInvoices;
