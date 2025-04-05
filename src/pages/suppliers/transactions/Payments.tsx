
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Filter, Plus, Calendar, DollarSign } from 'lucide-react';
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

const payments = [
  { id: 'PAY-2023-001', supplier: 'Tech Solutions Inc.', date: '2023-06-15', amount: 5624.99, method: 'Bank Transfer', reference: 'INV-2023-001' },
  { id: 'PAY-2023-002', supplier: 'Office Supplies Co.', date: '2023-06-18', amount: 1287.50, method: 'Credit Card', reference: 'INV-2023-002' },
  { id: 'PAY-2023-003', supplier: 'Furniture Depot', date: '2023-07-01', amount: 8745.00, method: 'Check', reference: 'INV-2023-003' },
  { id: 'PAY-2023-004', supplier: 'Electronics Warehouse', date: '2023-07-05', amount: 3456.78, method: 'Bank Transfer', reference: 'INV-2023-004' },
  { id: 'PAY-2023-005', supplier: 'Industrial Parts Ltd.', date: '2023-07-10', amount: 12589.99, method: 'ACH', reference: 'INV-2023-005' },
  { id: 'PAY-2023-006', supplier: 'Building Materials Inc.', date: '2023-07-15', amount: 6543.21, method: 'Wire Transfer', reference: 'INV-2023-006' },
  { id: 'PAY-2023-007', supplier: 'Tech Solutions Inc.', date: '2023-07-20', amount: 2345.67, method: 'Credit Card', reference: 'INV-2023-007' },
  { id: 'PAY-2023-008', supplier: 'Office Supplies Co.', date: '2023-07-25', amount: 876.54, method: 'Bank Transfer', reference: 'INV-2023-008' },
];

const stats = [
  { 
    title: "Total Payments", 
    value: "$41,469.68", 
    description: "Current month", 
    icon: <DollarSign className="h-4 w-4" />,
    color: "text-blue-600"
  },
  { 
    title: "Average Payment", 
    value: "$5,183.71", 
    description: "Per transaction", 
    icon: <DollarSign className="h-4 w-4" />,
    color: "text-purple-600" 
  },
  { 
    title: "Next Scheduled", 
    value: "$8,750.00", 
    description: "Due in 3 days", 
    icon: <Calendar className="h-4 w-4" />,
    color: "text-green-600"
  },
];

const getMethodBadge = (method: string) => {
  switch (method) {
    case 'Bank Transfer':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'Credit Card':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'Check':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    case 'ACH':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Wire Transfer':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const Payments = () => {
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
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-muted-foreground">Manage and track supplier payments</p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Record New Payment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-2 rounded-full bg-muted ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Filters</CardTitle>
          <CardDescription>Filter and search payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Input type="text" placeholder="Search payments..." />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="ach">ACH</SelectItem>
                  <SelectItem value="wire-transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Payment History</CardTitle>
              <CardDescription>Showing {payments.length} payments</CardDescription>
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
                  <TableHead className="w-[120px]">Payment #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.supplier}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.reference}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getMethodBadge(payment.method)}>
                        {payment.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${payment.amount.toLocaleString()}</TableCell>
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

export default Payments;
