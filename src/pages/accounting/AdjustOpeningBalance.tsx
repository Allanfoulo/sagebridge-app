
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Search, FilterX, AlertCircle, Info, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Sample data for accounts
const accounts = [
  {
    id: 1,
    name: 'Cash in Hand',
    category: 'Assets',
    accountNumber: '1010',
    currentBalance: 5000.00,
    openingBalance: 4500.00,
    openingDate: '2023-01-01',
    lastAdjusted: 'Never'
  },
  {
    id: 2,
    name: 'Accounts Receivable',
    category: 'Assets',
    accountNumber: '1200',
    currentBalance: 12500.50,
    openingBalance: 10000.00,
    openingDate: '2023-01-01',
    lastAdjusted: '2023-02-15'
  },
  {
    id: 3,
    name: 'Inventory',
    category: 'Assets',
    accountNumber: '1300',
    currentBalance: 45000.00,
    openingBalance: 35000.00,
    openingDate: '2023-01-01',
    lastAdjusted: '2023-03-01'
  },
  {
    id: 4,
    name: 'Accounts Payable',
    category: 'Liabilities',
    accountNumber: '2000',
    currentBalance: 8750.25,
    openingBalance: 5000.00,
    openingDate: '2023-01-01',
    lastAdjusted: 'Never'
  },
  {
    id: 5,
    name: 'Loans Payable',
    category: 'Liabilities',
    accountNumber: '2100',
    currentBalance: 50000.00,
    openingBalance: 50000.00,
    openingDate: '2023-01-01',
    lastAdjusted: 'Never'
  },
  {
    id: 6,
    name: 'Retained Earnings',
    category: 'Equity',
    accountNumber: '3100',
    currentBalance: 75000.00,
    openingBalance: 70000.00,
    openingDate: '2023-01-01',
    lastAdjusted: '2023-01-30'
  }
];

const AdjustOpeningBalance = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter accounts based on search term and category
  const filteredAccounts = accounts.filter(account => 
    (account.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     account.accountNumber.includes(searchTerm)) &&
    (categoryFilter === 'all' ? true : account.category === categoryFilter)
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/accounting')}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Accounting
          </Button>
        </div>
        
        <div className="bg-sage-blue rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-white mb-2">Adjust Opening Balances</h1>
          <p className="text-white/80">Set or adjust the starting balances for your accounts</p>
        </div>
        
        <Alert variant="warning" className="bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Adjusting opening balances should typically only be done during initial setup or when correcting significant errors.
            These changes will affect your historical financial reports.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Account Opening Balances</CardTitle>
            <CardDescription>
              Select an account to adjust its opening balance as of a specific date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  className="w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
                    <FilterX className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Assets">Assets</SelectItem>
                    <SelectItem value="Liabilities">Liabilities</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Expenses">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Account #</TableHead>
                    <TableHead>Opening Balance</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Opening Date</TableHead>
                    <TableHead>Last Adjusted</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.category}</TableCell>
                      <TableCell>{account.accountNumber}</TableCell>
                      <TableCell>R{account.openingBalance.toFixed(2)}</TableCell>
                      <TableCell>R{account.currentBalance.toFixed(2)}</TableCell>
                      <TableCell>{account.openingDate}</TableCell>
                      <TableCell>{account.lastAdjusted}</TableCell>
                      <TableCell>
                        <Button size="sm">Adjust</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredAccounts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No accounts match your search criteria
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About Opening Balances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-sage-blue flex-shrink-0 mt-1" />
                <p>Opening balances represent the starting point for your accounts as of a specific date</p>
              </div>
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-sage-blue flex-shrink-0 mt-1" />
                <p>For balance sheet accounts (assets, liabilities, equity), opening balances should reflect their value at the start of your fiscal year</p>
              </div>
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-sage-blue flex-shrink-0 mt-1" />
                <p>Income and expense accounts typically start with a zero balance each fiscal year</p>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-1" />
                <p>Adjusting opening balances will create journal entries to reflect the changes and maintain the integrity of your accounting system</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opening Balance Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span>Total Asset Opening Balances:</span>
                <span className="font-medium">R49,500.00</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span>Total Liability Opening Balances:</span>
                <span className="font-medium">R55,000.00</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span>Total Equity Opening Balances:</span>
                <span className="font-medium">R70,000.00</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium">Accounting Equation:</span>
                <span className="font-medium text-green-600">Balanced <CheckCircle className="h-4 w-4 inline ml-1" /></span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Assets (R49,500.00) = Liabilities (R55,000.00) + Equity (R70,000.00) - Historical Adjustment (-R75,500.00)
              </div>
            </CardContent>
            <CardFooter className="bg-sage-lightGray/30 flex justify-end">
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Change Opening Date
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default AdjustOpeningBalance;
