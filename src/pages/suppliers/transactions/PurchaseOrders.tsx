
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';

interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_id: string;
  supplier_name?: string;
  issue_date: string;
  total_amount: number;
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [suppliers, setSuppliers] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          id,
          order_number,
          supplier_id,
          issue_date,
          total_amount,
          status,
          suppliers (
            name
          )
        `)
        .order('issue_date', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(po => ({
        id: po.id,
        order_number: po.order_number,
        supplier_id: po.supplier_id,
        supplier_name: po.suppliers?.name || 'Unknown Supplier',
        issue_date: po.issue_date,
        total_amount: po.total_amount,
        status: po.status
      })) || [];

      setPurchaseOrders(formattedData);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status.toLowerCase() === statusFilter;
    const matchesSupplier = supplierFilter === 'all' || po.supplier_id === supplierFilter;
    
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
          onClick={() => navigate('/suppliers')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Suppliers
        </Button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Purchase Orders</h1>
            <p className="text-muted-foreground">Manage and track purchase orders for all suppliers</p>
          </div>
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Filters</CardTitle>
            <CardDescription>Filter and search purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="grid w-full md:max-w-sm items-center gap-1.5">
                <Input 
                  type="text" 
                  placeholder="Search purchase orders..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid w-full md:max-w-sm items-center gap-1.5">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full md:max-w-sm items-center gap-1.5">
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium">Purchase Orders</CardTitle>
                <CardDescription>
                  Showing {filteredPurchaseOrders.length} purchase order{filteredPurchaseOrders.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span className="ml-3">Loading purchase orders...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchaseOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No purchase orders found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPurchaseOrders.map((po) => (
                        <TableRow key={po.id}>
                          <TableCell className="font-medium">{po.order_number}</TableCell>
                          <TableCell>{po.supplier_name}</TableCell>
                          <TableCell>{new Date(po.issue_date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">${po.total_amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(po.status)}>
                              {po.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default PurchaseOrders;
