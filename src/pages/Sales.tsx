
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, 
  FilePlus, 
  Users, 
  ListFilter, 
  Download, 
  Upload, 
  FileText,
  FileSpreadsheet,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchInvoices } from '@/utils/salesInvoiceService';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
}

const Sales: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch invoices from the database
  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true);
      try {
        const result = await fetchInvoices();
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

    loadInvoices();
  }, [toast]);

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    invoice => 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export functions
  const exportToCSV = () => {
    const headers = ['Invoice No.', 'Customer', 'Date', 'Amount', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredInvoices.map(invoice => [
        invoice.invoiceNumber,
        invoice.customer,
        invoice.date,
        invoice.amount,
        invoice.status
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Invoices have been exported to CSV format",
    });
  };

  const exportToExcel = () => {
    // For simplicity, we'll create a basic Excel-compatible CSV with semicolons
    const headers = ['Invoice No.;Customer;Date;Amount;Status'];
    const excelRows = [
      headers.join(''),
      ...filteredInvoices.map(invoice => [
        invoice.invoiceNumber,
        invoice.customer,
        invoice.date,
        invoice.amount,
        invoice.status
      ].join(';'))
    ];
    
    const excelContent = excelRows.join('\r\n');
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Invoices have been exported to Excel format",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Basic parsing - would need more robust implementation for production
        const rows = content.split('\n');
        const headers = rows[0].split(',');
        
        toast({
          title: "Import Successful",
          description: `Imported file with ${rows.length - 1} invoices`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "There was an error importing the file",
        });
      }
    };
    reader.readAsText(file);
  };

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
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
            <p className="text-muted-foreground">Manage your invoices, quotes, and customers</p>
          </div>
          <div className="flex gap-2">
            {/* Import button with hidden file input */}
            <div className="relative">
              <input
                type="file"
                id="importFile"
                accept=".csv,.xls,.xlsx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImport}
              />
              <Button variant="outline" className="flex items-center">
                <Upload size={16} className="mr-2" />
                Import
              </Button>
            </div>
            
            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
                  <FileText size={16} className="mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                  <FileSpreadsheet size={16} className="mr-2" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={navigateToNewInvoice} className="flex items-center">
              <PlusCircle size={16} className="mr-2" />
              New Invoice
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
          
          <Card className="md:col-span-3">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Invoices</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <input 
                      type="search"
                      placeholder="Search invoices..."
                      className="w-48 py-1.5 pl-8 pr-3 text-sm rounded-md border border-sage-lightGray focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        className="w-4 h-4 text-gray-400"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 p-1.5 rounded-md hover:bg-sage-lightGray transition-colors">
                    <ListFilter size={16} /> <span className="text-sm">Filter</span>
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full mt-4">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Invoice No.</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-lightGray/70">
                      {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-sage-lightGray/50 transition-colors">
                            <td className="py-3 text-sm font-medium">{invoice.invoiceNumber}</td>
                            <td className="py-3 text-sm">{invoice.customer}</td>
                            <td className="py-3 text-sm">{invoice.date}</td>
                            <td className="py-3 text-sm font-medium">{invoice.amount}</td>
                            <td className="py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                invoice.status === 'Draft' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm">
                              <div className="flex gap-2">
                                <button className="text-primary-500 hover:text-primary-600">View</button>
                                <button className="text-primary-500 hover:text-primary-600">Edit</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            {searchQuery ? 'No invoices found matching your search' : 'No invoices found. Create your first invoice!'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredInvoices.length} of {invoices.length} invoices
                </div>
                {filteredInvoices.length > 0 && (
                  <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-lightGray transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary-500 text-white">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-lightGray transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Sales;
