
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Search, FilterX, Calendar, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Sample data for bank accounts
const bankAccounts = [
  {
    id: 1,
    name: 'Main Checking Account',
    accountNumber: '8742-9321-12',
    bankBalance: 24500.75,
    bookBalance: 23750.50,
    difference: 750.25,
    lastReconciled: '2023-03-15',
    status: 'Needs Reconciliation'
  },
  {
    id: 2,
    name: 'Business Savings',
    accountNumber: '8742-9876-34',
    bankBalance: 45000.00,
    bookBalance: 45000.00,
    difference: 0.00,
    lastReconciled: '2023-04-01',
    status: 'Reconciled'
  },
  {
    id: 3,
    name: 'Operations Account',
    accountNumber: '8742-5432-56',
    bankBalance: 15750.25,
    bookBalance: 14980.75,
    difference: 769.50,
    lastReconciled: '2023-02-28',
    status: 'Needs Reconciliation'
  },
  {
    id: 4, 
    name: 'Payroll Account',
    accountNumber: '8742-1234-78',
    bankBalance: 5200.00,
    bookBalance: 5200.00,
    difference: 0.00,
    lastReconciled: '2023-04-02',
    status: 'Reconciled'
  }
];

const ReconcileAccounts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter accounts based on search term
  const filteredAccounts = bankAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountNumber.includes(searchTerm)
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
          <h1 className="text-2xl font-semibold text-white mb-2">Reconcile Accounts</h1>
          <p className="text-white/80">Match your book records with external statements</p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bank Accounts</CardTitle>
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
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filter by Date
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Bank Balance</TableHead>
                    <TableHead>Book Balance</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Last Reconciled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.accountNumber}</TableCell>
                      <TableCell>R{account.bankBalance.toFixed(2)}</TableCell>
                      <TableCell>R{account.bookBalance.toFixed(2)}</TableCell>
                      <TableCell className={account.difference === 0 ? "text-green-600" : "text-amber-600"}>
                        {account.difference === 0 ? "Balanced" : `R${account.difference.toFixed(2)}`}
                      </TableCell>
                      <TableCell>{account.lastReconciled}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          account.status === 'Reconciled' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {account.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant={account.status === 'Reconciled' ? "outline" : "default"}
                        >
                          {account.status === 'Reconciled' ? 'View' : 'Reconcile'}
                        </Button>
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
              <CardTitle className="text-base">Reconciliation Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-2">
                <CheckSquare className="h-4 w-4 text-sage-blue flex-shrink-0 mt-1" />
                <p>Compare your book records with your bank statements regularly</p>
              </div>
              <div className="flex gap-2">
                <CheckSquare className="h-4 w-4 text-sage-blue flex-shrink-0 mt-1" />
                <p>Look for transactions that appear in your books but not on your bank statement (outstanding items)</p>
              </div>
              <div className="flex gap-2">
                <CheckSquare className="h-4 w-4 text-sage-blue flex-shrink-0 mt-1" />
                <p>Identify bank charges, interest, and other transactions that might be missing from your books</p>
              </div>
              <div className="flex gap-2">
                <CheckSquare className="h-4 w-4 text-sage-blue flex-shrink-0 mt-1" />
                <p>Aim to reconcile accounts at least monthly to catch errors early</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Reconciliations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 hover:bg-sage-lightGray rounded-md transition-colors">
                  <div>
                    <p className="font-medium">Main Checking Account</p>
                    <p className="text-xs text-muted-foreground">March 15, 2023</p>
                  </div>
                  <span className="text-green-600 font-medium">Balanced</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-sage-lightGray rounded-md transition-colors">
                  <div>
                    <p className="font-medium">Business Savings</p>
                    <p className="text-xs text-muted-foreground">April 1, 2023</p>
                  </div>
                  <span className="text-green-600 font-medium">Balanced</span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-sage-lightGray rounded-md transition-colors">
                  <div>
                    <p className="font-medium">Payroll Account</p>
                    <p className="text-xs text-muted-foreground">April 2, 2023</p>
                  </div>
                  <span className="text-green-600 font-medium">Balanced</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ReconcileAccounts;
