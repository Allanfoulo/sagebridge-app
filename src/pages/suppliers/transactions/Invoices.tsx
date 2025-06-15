import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Filter, Plus, Calendar, DollarSign } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSupplierInvoices } from '@/hooks/useSupplierInvoices';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const Invoices = () => {
  const navigate = useNavigate();
  const {
    invoices,
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    supplierFilter,
    setSupplierFilter,
    stats
  } = useSupplierInvoices();

  const statsData = [
    { 
      title: "Total Outstanding", 
      value: `$${stats.totalOutstanding.toLocaleString()}`, 
      description: `From ${stats.pendingCount + stats.overdueCount} invoices`, 
      icon: <DollarSign className="h-4 w-4" />,
      color: "text-yellow-600"
    },
    { 
      title: "Overdue", 
      value: `$${stats.overdue.toLocaleString()}`, 
      description: `${stats.overdueCount} invoices past due date`, 
      icon: <Calendar className="h-4 w-4" />,
      color: "text-red-600" 
    },
    { 
      title: "Paid this month", 
      value: `$${stats.paidThisMonth.toLocaleString()}`, 
      description: `${stats.paidCount} invoices paid`, 
      icon: <DollarSign className="h-4 w-4" />,
      color: "text-green-600"
    },
  ];

  const filterInvoicesByStatus = (status: string) => {
    if (status === 'all') return invoices;
    return invoices.filter(invoice => invoice.status.toLowerCase() === status.toLowerCase());
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="text-center">Loading invoices...</div>
      </motion.div>
    );
  }

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
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground">Manage and track supplier invoices</p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Record New Invoice
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
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

      {/* Tabs for Invoice Categories */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Filters</CardTitle>
              <CardDescription>Filter and search invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="grid w-full md:max-w-sm items-center gap-1.5">
                  <Input 
                    type="text" 
                    placeholder="Search invoices..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">All Invoices</CardTitle>
                  <CardDescription>Showing {invoices.length} invoices</CardDescription>
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
                      <TableHead className="w-[120px]">Invoice #</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{invoice.supplier_name}</TableCell>
                        <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">${invoice.total_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(invoice.status)}>
                            {invoice.status}
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
        </TabsContent>

        {/* Other tab contents with filtered data */}
        {['pending', 'paid', 'overdue'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{status.charAt(0).toUpperCase() + status.slice(1)} Invoices</CardTitle>
                <CardDescription>
                  {status === 'pending' && 'Invoices awaiting payment'}
                  {status === 'paid' && 'Completed invoice payments'}
                  {status === 'overdue' && 'Past-due invoices requiring attention'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Invoice #</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterInvoicesByStatus(status).map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{invoice.supplier_name}</TableCell>
                        <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">${invoice.total_amount.toLocaleString()}</TableCell>
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
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};

export default Invoices;
