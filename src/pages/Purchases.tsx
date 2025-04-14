
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Package, FileText, Building, Download, Upload, Search, Filter, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PurchaseInvoice {
  id: string;
  invoice_number: string;
  supplier: {
    name: string;
  };
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: string;
}

const Purchases: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample expense categories for the dashboard
  const expenseCategories = [
    { name: 'Office Supplies', amount: 2450 },
    { name: 'Software & IT', amount: 3870 },
    { name: 'Marketing', amount: 5340 },
    { name: 'Travel', amount: 1230 },
    { name: 'Utilities', amount: 890 }
  ];

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('supplier_invoices')
        .select(`
          id, 
          invoice_number, 
          issue_date, 
          due_date, 
          total_amount, 
          status,
          supplier:supplier_id (name)
        `)
        .order('issue_date', { ascending: false });
        
      if (error) throw error;
      
      setInvoices(data || []);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load purchase invoices',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-2xl font-bold tracking-tight">Purchases</h1>
            <p className="text-muted-foreground">Manage your bills, expenses, and vendors</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload size={16} className="mr-1" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={16} className="mr-1" />
              Export
            </Button>
            <Button 
              onClick={() => navigate('/purchases/new-invoice')} 
              className="bg-primary hover:bg-primary/90 text-white"
              size="sm"
            >
              <PlusCircle size={16} className="mr-2" />
              New Purchase
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-base">Purchases Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/purchases/new-invoice')} 
                className="bg-primary hover:bg-primary/90 text-white w-full"
              >
                <FileText size={16} className="mr-2" />
                New Invoice
              </Button>
              <Button 
                onClick={() => navigate('/suppliers/transactions/purchase-orders')} 
                variant="outline" 
                className="w-full"
              >
                <Package size={16} className="mr-2" />
                Purchase Order
              </Button>
              <Button 
                onClick={() => navigate('/suppliers')} 
                variant="outline" 
                className="w-full"
              >
                <Building size={16} className="mr-2" />
                Supplier Management
              </Button>
              
              <div className="pt-4 border-t border-sage-lightGray">
                <h4 className="font-medium text-sm mb-3">Expense Categories</h4>
                <div className="space-y-2">
                  {expenseCategories.map((category) => (
                    <div key={category.name} className="flex justify-between items-center text-sm">
                      <span>{category.name}</span>
                      <span className="text-muted-foreground">R{category.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-9">
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="text-base">Purchase Invoices</CardTitle>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search invoices..."
                      className="pl-8 w-full md:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full mt-4">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Invoice No.</th>
                        <th className="pb-3 font-medium">Supplier</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Due Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-lightGray/70">
                      {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-sage-lightGray/50 transition-colors">
                            <td className="py-3 text-sm font-medium">{invoice.invoice_number}</td>
                            <td className="py-3 text-sm">{invoice.supplier?.name || 'Unknown'}</td>
                            <td className="py-3 text-sm">{new Date(invoice.issue_date).toLocaleDateString()}</td>
                            <td className="py-3 text-sm">{new Date(invoice.due_date).toLocaleDateString()}</td>
                            <td className="py-3 text-sm font-medium">${invoice.total_amount.toFixed(2)}</td>
                            <td className="py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 p-0 px-2">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-muted-foreground">
                            {searchQuery || statusFilter !== 'all' 
                              ? 'No invoices found matching your filters' 
                              : 'No purchase invoices found. Create your first invoice!'}
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
                    <Button variant="outline" size="icon" className="w-8 h-8">
                      <span className="sr-only">Previous</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="w-8 h-8 bg-primary text-white">
                      1
                    </Button>
                    <Button variant="outline" size="icon" className="w-8 h-8">
                      <span className="sr-only">Next</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </Button>
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

export default Purchases;
