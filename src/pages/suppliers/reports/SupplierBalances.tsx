
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, FileText, FileSpreadsheet, FileIcon } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChartContainer } from '@/components/ui/chart';
import { DatePickerWithRange } from '@/components/suppliers/reports/DateRangePicker';
import TopSupplierBalanceChart from '@/components/suppliers/reports/TopSupplierBalanceChart';
import PayablesTrendChart from '@/components/suppliers/reports/PayablesTrendChart';
import CategoryDonutChart from '@/components/suppliers/reports/CategoryDonutChart';

// Mock data for the supplier balances
const supplierBalanceData = [
  { id: 'SP001', name: 'Tech Solutions Inc.', category: 'Technology', currentBalance: 12500.00, previousBalance: 15000.00, overdue: 0, lastPaymentDate: '2024-03-15', lastPaymentAmount: 2500.00 },
  { id: 'SP002', name: 'Office Supply Co.', category: 'Office Supplies', currentBalance: 5750.50, previousBalance: 6200.00, overdue: 1250.50, lastPaymentDate: '2024-02-28', lastPaymentAmount: 450.00 },
  { id: 'SP004', name: 'Quality Manufacturing', category: 'Manufacturing', currentBalance: 18200.00, previousBalance: 20000.00, overdue: 0, lastPaymentDate: '2024-03-05', lastPaymentAmount: 1800.00 },
  { id: 'SP005', name: 'Precision Parts Ltd.', category: 'Manufacturing', currentBalance: 9300.75, previousBalance: 12000.00, overdue: 2300.75, lastPaymentDate: '2024-01-20', lastPaymentAmount: 2700.00 },
  { id: 'SP007', name: 'Sterling Marketing', category: 'Marketing', currentBalance: 6500.00, previousBalance: 8000.00, overdue: 0, lastPaymentDate: '2024-03-01', lastPaymentAmount: 1500.00 },
  { id: 'SP008', name: 'Johnson Consulting', category: 'Services', currentBalance: 11000.00, previousBalance: 13500.00, overdue: 0, lastPaymentDate: '2024-02-15', lastPaymentAmount: 2500.00 },
  { id: 'SP010', name: 'Packaging Pros', category: 'Materials', currentBalance: 7800.25, previousBalance: 9000.00, overdue: 0, lastPaymentDate: '2024-03-10', lastPaymentAmount: 1200.00 },
  { id: 'SP011', name: 'Data Systems LLC', category: 'Technology', currentBalance: 15750.00, previousBalance: 18000.00, overdue: 5750.00, lastPaymentDate: '2024-01-05', lastPaymentAmount: 2250.00 },
  { id: 'SP013', name: 'Media Solutions', category: 'Marketing', currentBalance: 8200.50, previousBalance: 10000.00, overdue: 0, lastPaymentDate: '2024-02-20', lastPaymentAmount: 1800.00 },
  { id: 'SP014', name: 'Industrial Metals', category: 'Manufacturing', currentBalance: 21500.00, previousBalance: 25000.00, overdue: 10000.00, lastPaymentDate: '2024-01-15', lastPaymentAmount: 3500.00 },
  { id: 'SP015', name: 'Logistics Partners', category: 'Logistics', currentBalance: 13400.75, previousBalance: 16000.00, overdue: 0, lastPaymentDate: '2024-03-02', lastPaymentAmount: 2600.00 },
  { id: 'SP016', name: 'Cloud Services Inc', category: 'Technology', currentBalance: 19800.50, previousBalance: 22000.00, overdue: 4800.50, lastPaymentDate: '2024-02-01', lastPaymentAmount: 2200.00 },
];

// Monthly payables trend data (last 12 months)
const monthlyPayablesTrendData = [
  { month: 'Apr 2023', amount: 95000 },
  { month: 'May 2023', amount: 102000 },
  { month: 'Jun 2023', amount: 118000 },
  { month: 'Jul 2023', amount: 110000 },
  { month: 'Aug 2023', amount: 125000 },
  { month: 'Sep 2023', amount: 132000 },
  { month: 'Oct 2023', amount: 140000 },
  { month: 'Nov 2023', amount: 135000 },
  { month: 'Dec 2023', amount: 150000 },
  { month: 'Jan 2024', amount: 142000 },
  { month: 'Feb 2024', amount: 138000 },
  { month: 'Mar 2024', amount: 155000 },
];

// Donut chart data for payables by category
const payablesByCategoryData = [
  { name: 'Technology', value: 48050.50 },
  { name: 'Manufacturing', value: 49000.75 },
  { name: 'Marketing', value: 14700.50 },
  { name: 'Logistics', value: 13400.75 },
  { name: 'Office Supplies', value: 5750.50 },
  { name: 'Services', value: 11000.00 },
  { name: 'Materials', value: 7800.25 },
];

// Sort categories by value for chart display
const sortedCategoryData = [...payablesByCategoryData].sort((a, b) => b.value - a.value);

const SupplierBalances = () => {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentView, setCurrentView] = useState('summary');

  // Filter suppliers based on selections
  const filteredSuppliers = supplierBalanceData.filter(supplier => {
    if (selectedCategory !== 'all' && supplier.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus === 'overdue' && supplier.overdue === 0) {
      return false;
    }
    if (selectedStatus === 'current' && supplier.overdue > 0) {
      return false;
    }
    return true;
  });

  // Sort suppliers by balance for top 10 chart
  const topSuppliers = [...filteredSuppliers]
    .sort((a, b) => b.currentBalance - a.currentBalance)
    .slice(0, 10);

  // Calculate totals
  const totalCurrentBalance = filteredSuppliers.reduce((sum, supplier) => sum + supplier.currentBalance, 0);
  const totalOverdue = filteredSuppliers.reduce((sum, supplier) => sum + supplier.overdue, 0);
  const overduePercentage = (totalOverdue / totalCurrentBalance) * 100 || 0;

  // Handle export functionality
  const handleExport = (format: string) => {
    console.log(`Exporting in ${format} format`);
    // In a real application, this would trigger the export process
  };

  // Extract unique categories for filter dropdown
  const categories = Array.from(new Set(supplierBalanceData.map(supplier => supplier.category)));

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">Supplier Balances Report</h1>
              <p className="text-white/80">Analyze outstanding supplier balances and payment trends</p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-white/90 shadow flex gap-2 items-center"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Export as PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Export as Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
                    <FileIcon className="mr-2 h-4 w-4" />
                    <span>Export as CSV</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <DatePickerWithRange className="w-full" dateRange={dateRange} setDateRange={setDateRange} />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Supplier Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Payment Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Payables</CardTitle>
              <CardDescription>Current balance across all suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                ${totalCurrentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overdue Amount</CardTitle>
              <CardDescription>Total overdue across all suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                ${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overdue Percentage</CardTitle>
              <CardDescription>Percentage of total payables overdue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: overduePercentage > 20 ? '#ef4444' : overduePercentage > 10 ? '#f59e0b' : '#22c55e' }}>
                {overduePercentage.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <ToggleGroup type="single" value={currentView} onValueChange={(value) => {
            if (value) setCurrentView(value);
          }}>
            <ToggleGroupItem value="summary" aria-label="View summary dashboard">
              Dashboard View
            </ToggleGroupItem>
            <ToggleGroupItem value="details" aria-label="View detailed data">
              Detailed View
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {currentView === 'summary' ? (
          <div className="space-y-6">
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Suppliers by Balance</CardTitle>
                  <CardDescription>Outstanding balances of highest value suppliers</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <TopSupplierBalanceChart suppliers={topSuppliers} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Total Payables Trend (12 Months)</CardTitle>
                  <CardDescription>Monthly trend of total supplier payables</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <PayablesTrendChart data={monthlyPayablesTrendData} />
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Row 2 */}
            <Card>
              <CardHeader>
                <CardTitle>Payables by Supplier Category</CardTitle>
                <CardDescription>Distribution of outstanding balances by category</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <CategoryDonutChart data={sortedCategoryData} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Supplier Balances</CardTitle>
              <CardDescription>Comprehensive view of all supplier balances and payment info</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Current Balance</TableHead>
                    <TableHead className="text-right">Previous Balance</TableHead>
                    <TableHead className="text-right">Overdue Amount</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead className="text-right">Payment Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className={supplier.overdue > 0 ? "bg-red-50" : ""}>
                      <TableCell className="font-medium">{supplier.id}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.category}</TableCell>
                      <TableCell className="text-right font-mono">
                        ${supplier.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${supplier.previousBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${supplier.overdue > 0 ? "text-red-500 font-semibold" : ""}`}>
                        ${supplier.overdue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{supplier.lastPaymentDate}</TableCell>
                      <TableCell className="text-right font-mono">
                        ${supplier.lastPaymentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default SupplierBalances;
