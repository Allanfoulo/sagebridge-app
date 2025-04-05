
import React from 'react';
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

const purchaseOrders = [
  { id: 'PO-2023-001', supplier: 'Tech Solutions Inc.', date: '2023-06-15', total: 5624.99, status: 'Completed' },
  { id: 'PO-2023-002', supplier: 'Office Supplies Co.', date: '2023-06-18', total: 1287.50, status: 'Pending' },
  { id: 'PO-2023-003', supplier: 'Furniture Depot', date: '2023-06-20', total: 8745.00, status: 'Processing' },
  { id: 'PO-2023-004', supplier: 'Electronics Warehouse', date: '2023-06-22', total: 3456.78, status: 'Completed' },
  { id: 'PO-2023-005', supplier: 'Industrial Parts Ltd.', date: '2023-06-25', total: 12589.99, status: 'Pending' },
  { id: 'PO-2023-006', supplier: 'Building Materials Inc.', date: '2023-06-28', total: 6543.21, status: 'Processing' },
  { id: 'PO-2023-007', supplier: 'Tech Solutions Inc.', date: '2023-07-01', total: 2345.67, status: 'Completed' },
  { id: 'PO-2023-008', supplier: 'Office Supplies Co.', date: '2023-07-05', total: 876.54, status: 'Processing' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Processing':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const PurchaseOrders = () => {
  const navigate = useNavigate();

  return (
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
              <Input type="text" placeholder="Search purchase orders..." />
            </div>
            <div className="grid w-full md:max-w-sm items-center gap-1.5">
              <Select>
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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="tech-solutions">Tech Solutions Inc.</SelectItem>
                  <SelectItem value="office-supplies">Office Supplies Co.</SelectItem>
                  <SelectItem value="furniture-depot">Furniture Depot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Purchase Orders</CardTitle>
              <CardDescription>Showing {purchaseOrders.length} purchase orders</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
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
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.id}</TableCell>
                    <TableCell>{po.supplier}</TableCell>
                    <TableCell>{new Date(po.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${po.total.toLocaleString()}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PurchaseOrders;
