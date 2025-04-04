
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Search,
  FileDown,
  Filter,
  CalendarRange,
  ArrowLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sample GL transactions
const glTransactions = [
  {
    id: 1,
    date: '2023-06-05',
    account: 'Cash',
    reference: 'INV-1001',
    description: 'Customer payment - ABC Corp',
    debit: 'R5,000.00',
    credit: '',
    balance: 'R25,000.00',
    reconciled: true,
    source: 'Sales',
  },
  {
    id: 2,
    date: '2023-06-04',
    account: 'Accounts Receivable',
    reference: 'INV-1001',
    description: 'Invoice issued - ABC Corp',
    debit: 'R5,000.00',
    credit: '',
    balance: 'R15,000.00',
    reconciled: true,
    source: 'Sales',
  },
  {
    id: 3,
    date: '2023-06-03',
    account: 'Office Supplies',
    reference: 'EXP-101',
    description: 'Purchase of stationery',
    debit: 'R350.00',
    credit: '',
    balance: 'R1,200.00',
    reconciled: false,
    source: 'Purchases',
  },
  {
    id: 4,
    date: '2023-06-02',
    account: 'Cash',
    reference: 'EXP-101',
    description: 'Purchase of stationery',
    debit: '',
    credit: 'R350.00',
    balance: 'R20,000.00',
    reconciled: false,
    source: 'Purchases',
  },
  {
    id: 5,
    date: '2023-06-01',
    account: 'Rent Expense',
    reference: 'JE-1001',
    description: 'Monthly office rent',
    debit: 'R3,500.00',
    credit: '',
    balance: 'R7,000.00',
    reconciled: true,
    source: 'Journal Entry',
  },
  {
    id: 6,
    date: '2023-06-01',
    account: 'Cash',
    reference: 'JE-1001',
    description: 'Monthly office rent',
    debit: '',
    credit: 'R3,500.00',
    balance: 'R20,350.00',
    reconciled: true,
    source: 'Journal Entry',
  },
  {
    id: 7,
    date: '2023-05-30',
    account: 'Salaries Expense',
    reference: 'PAY-052023',
    description: 'May 2023 payroll',
    debit: 'R8,500.00',
    credit: '',
    balance: 'R25,500.00',
    reconciled: true,
    source: 'Payroll',
  },
  {
    id: 8,
    date: '2023-05-30',
    account: 'Cash',
    reference: 'PAY-052023',
    description: 'May 2023 payroll',
    debit: '',
    credit: 'R8,500.00',
    balance: 'R23,850.00',
    reconciled: true,
    source: 'Payroll',
  },
  {
    id: 9,
    date: '2023-05-28',
    account: 'Utility Expense',
    reference: 'EXP-099',
    description: 'Electricity bill',
    debit: 'R1,200.00',
    credit: '',
    balance: 'R3,600.00',
    reconciled: true,
    source: 'Purchases',
  },
  {
    id: 10,
    date: '2023-05-28',
    account: 'Cash',
    reference: 'EXP-099',
    description: 'Electricity bill',
    debit: '',
    credit: 'R1,200.00',
    balance: 'R32,350.00',
    reconciled: true,
    source: 'Purchases',
  },
];

const GeneralLedger = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedSource, setSelectedSource] = useState<string>('');
  
  // Filter transactions based on search and filters
  const filteredTransactions = glTransactions
    .filter(transaction => 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.account.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(transaction => 
      selectedAccount ? transaction.account === selectedAccount : true
    )
    .filter(transaction => 
      selectedSource ? transaction.source === selectedSource : true
    )
    .filter(transaction => {
      if (!dateRange.from) return true;
      
      const transactionDate = new Date(transaction.date);
      
      if (dateRange.to) {
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      }
      
      return transactionDate.toDateString() === dateRange.from.toDateString();
    });
  
  // Get unique accounts for filter dropdown
  const uniqueAccounts = Array.from(new Set(glTransactions.map(t => t.account)));
  
  // Get unique sources for filter dropdown
  const uniqueSources = Array.from(new Set(glTransactions.map(t => t.source)));

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="text-sage-blue hover:text-sage-blue/90 hover:bg-sage-blue/10 flex items-center gap-2 text-sm font-medium"
            onClick={() => navigate('/accounting')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Accounting
          </Button>
        </div>
        
        {/* Header */}
        <div className="bg-sage-blue rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-white mb-2">General Ledger</h1>
          <p className="text-white/80">View and analyze all financial transactions</p>
        </div>
        
        {/* General Ledger Content */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {uniqueAccounts.map(account => (
                      <SelectItem key={account} value={account}>{account}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {uniqueSources.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>All Dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                    <div className="flex items-center justify-between p-3 border-t">
                      <Button variant="outline" size="sm" onClick={() => setDateRange({ from: undefined, to: undefined })}>
                        Clear
                      </Button>
                      <Button size="sm" onClick={() => document.body.click()}>
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter size={16} />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="gap-1 whitespace-nowrap">
                  <FileDown size={16} />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Transactions Table */}
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sage-lightGray">
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="w-[150px]">Account</TableHead>
                    <TableHead className="w-[120px]">Reference</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right w-[120px]">Debit</TableHead>
                    <TableHead className="text-right w-[120px]">Credit</TableHead>
                    <TableHead className="text-right w-[140px]">Running Balance</TableHead>
                    <TableHead className="w-[100px]">Source</TableHead>
                    <TableHead className="w-[80px]">Reconciled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.account}</TableCell>
                        <TableCell>{transaction.reference}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-right font-mono">
                          {transaction.debit || '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {transaction.credit || '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {transaction.balance}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-medium bg-sage-lightGray px-2 py-1 rounded">
                            {transaction.source}
                          </span>
                        </TableCell>
                        <TableCell>
                          {transaction.reconciled ? (
                            <CheckCircle2 size={16} className="text-green-500 mx-auto" />
                          ) : (
                            <XCircle size={16} className="text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Ledger Totals */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-sage-blue/20">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Debits</p>
                    <p className="text-lg font-medium">R23,550.00</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-sage-blue/20">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Credits</p>
                    <p className="text-lg font-medium">R13,550.00</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-sage-blue/20">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Change</p>
                    <p className="text-lg font-medium">R10,000.00</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default GeneralLedger;
