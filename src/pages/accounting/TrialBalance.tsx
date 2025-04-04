
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  FileDown,
  ChevronRight,
  ChevronDown,
  CalendarRange,
  ArrowLeft,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sample trial balance data
const trialBalance = {
  asOfDate: '2023-06-05',
  categories: [
    {
      name: 'Assets',
      accounts: [
        { name: 'Cash', accountNumber: '10001', debit: 'R25,000.00', credit: '' },
        { name: 'Accounts Receivable', accountNumber: '10002', debit: 'R15,000.00', credit: '' },
        { name: 'Inventory', accountNumber: '10003', debit: 'R32,100.00', credit: '' },
        { name: 'Prepaid Expenses', accountNumber: '10004', debit: 'R3,500.00', credit: '' },
        { name: 'Office Equipment', accountNumber: '10101', debit: 'R15,800.00', credit: '' },
        { name: 'Accumulated Depreciation', accountNumber: '10102', debit: '', credit: 'R4,200.00' },
      ],
      totalDebit: 'R91,400.00',
      totalCredit: 'R4,200.00'
    },
    {
      name: 'Liabilities',
      accounts: [
        { name: 'Accounts Payable', accountNumber: '20001', debit: '', credit: 'R12,300.00' },
        { name: 'Salaries Payable', accountNumber: '20002', debit: '', credit: 'R8,500.00' },
        { name: 'VAT Payable', accountNumber: '20003', debit: '', credit: 'R5,400.00' },
        { name: 'Long-term Loan', accountNumber: '20101', debit: '', credit: 'R75,000.00' },
      ],
      totalDebit: 'R0.00',
      totalCredit: 'R101,200.00'
    },
    {
      name: 'Equity',
      accounts: [
        { name: 'Share Capital', accountNumber: '30001', debit: '', credit: 'R50,000.00' },
        { name: 'Retained Earnings', accountNumber: '30002', debit: '', credit: 'R43,200.00' },
      ],
      totalDebit: 'R0.00',
      totalCredit: 'R93,200.00'
    },
    {
      name: 'Income',
      accounts: [
        { name: 'Sales Revenue', accountNumber: '40001', debit: '', credit: 'R124,500.00' },
        { name: 'Interest Income', accountNumber: '40002', debit: '', credit: 'R1,250.00' },
      ],
      totalDebit: 'R0.00',
      totalCredit: 'R125,750.00'
    },
    {
      name: 'Expenses',
      accounts: [
        { name: 'Cost of Goods Sold', accountNumber: '50001', debit: 'R68,300.00', credit: '' },
        { name: 'Rent Expense', accountNumber: '50002', debit: 'R12,000.00', credit: '' },
        { name: 'Utility Expense', accountNumber: '50003', debit: 'R3,450.00', credit: '' },
        { name: 'Salaries Expense', accountNumber: '50004', debit: 'R42,000.00', credit: '' },
        { name: 'Depreciation', accountNumber: '50005', debit: 'R5,200.00', credit: '' },
        { name: 'Office Supplies', accountNumber: '50006', debit: 'R2,000.00', credit: '' },
      ],
      totalDebit: 'R132,950.00',
      totalCredit: 'R0.00'
    }
  ],
  grandTotalDebit: 'R224,350.00',
  grandTotalCredit: 'R224,350.00'
};

const TrialBalance = () => {
  const navigate = useNavigate();
  const [asOfDate, setAsOfDate] = useState<Date | undefined>(new Date(trialBalance.asOfDate));
  const [openCategories, setOpenCategories] = useState<string[]>(['Assets', 'Liabilities', 'Equity', 'Income', 'Expenses']);
  const [trialBalanceType, setTrialBalanceType] = useState('standard');
  const [comparisonPeriod, setComparisonPeriod] = useState('none');
  
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };
  
  const isCollapsibleOpen = (category: string) => openCategories.includes(category);

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
          <h1 className="text-2xl font-semibold text-white mb-2">Trial Balance</h1>
          <p className="text-white/80">View account balances at a specific date</p>
        </div>
        
        {/* Trial Balance Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Trial Balance Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !asOfDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      {asOfDate ? (
                        format(asOfDate, "MMMM dd, yyyy")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={asOfDate}
                      onSelect={setAsOfDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Select value={trialBalanceType} onValueChange={setTrialBalanceType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Trial Balance Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="unadjusted">Unadjusted</SelectItem>
                    <SelectItem value="adjusted">Adjusted</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Comparison" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Comparison</SelectItem>
                    <SelectItem value="previousMonth">Previous Month</SelectItem>
                    <SelectItem value="previousYear">Previous Year</SelectItem>
                    <SelectItem value="custom">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="gap-1">
                  <FileDown size={16} />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Trial Balance Table */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Trial Balance as of {asOfDate ? format(asOfDate, "MMMM dd, yyyy") : trialBalance.asOfDate}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {trialBalanceType === 'standard' ? 'Standard' : 
                 trialBalanceType === 'unadjusted' ? 'Unadjusted' : 'Adjusted'} Trial Balance
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setOpenCategories(openCategories.length === trialBalance.categories.length ? [] : trialBalance.categories.map(c => c.name))}>
              {openCategories.length === trialBalance.categories.length ? 'Collapse All' : 'Expand All'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sage-lightGray">
                    <TableHead className="min-w-[300px]">Account</TableHead>
                    <TableHead className="w-[120px]">Account #</TableHead>
                    <TableHead className="text-right w-[150px]">Debit</TableHead>
                    <TableHead className="text-right w-[150px]">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {trialBalance.categories.map((category) => (
                    <React.Fragment key={category.name}>
                      <TableRow className="hover:bg-sage-lightGray cursor-pointer" onClick={() => toggleCategory(category.name)}>
                        <TableCell className="font-bold flex items-center">
                          {isCollapsibleOpen(category.name) ? 
                            <ChevronDown size={16} className="mr-2" /> : 
                            <ChevronRight size={16} className="mr-2" />
                          }
                          {category.name}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-medium font-mono">
                          {category.totalDebit !== 'R0.00' ? category.totalDebit : ''}
                        </TableCell>
                        <TableCell className="text-right font-medium font-mono">
                          {category.totalCredit !== 'R0.00' ? category.totalCredit : ''}
                        </TableCell>
                      </TableRow>
                      
                      {isCollapsibleOpen(category.name) && category.accounts.map((account) => (
                        <TableRow key={account.accountNumber} className="bg-sage-lightGray/20">
                          <TableCell className="pl-8">{account.name}</TableCell>
                          <TableCell className="font-mono text-xs">{account.accountNumber}</TableCell>
                          <TableCell className="text-right font-mono">
                            {account.debit || ''}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {account.credit || ''}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {/* Grand Totals */}
                  <TableRow className="font-bold bg-sage-lightGray">
                    <TableCell colSpan={2}>Grand Totals</TableCell>
                    <TableCell className="text-right font-mono">{trialBalance.grandTotalDebit}</TableCell>
                    <TableCell className="text-right font-mono">{trialBalance.grandTotalCredit}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 flex justify-between items-center p-4 bg-sage-lightGray/20 rounded-md">
              <div className="flex gap-10">
                <div>
                  <p className="text-sm text-muted-foreground">Total Debits</p>
                  <p className="text-lg font-medium">{trialBalance.grandTotalDebit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-lg font-medium">{trialBalance.grandTotalCredit}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Difference</p>
                <p className="text-lg font-medium">R0.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Trial Balance Explanation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">About Trial Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <p>
                The trial balance shows all the accounts in your general ledger and their balances as of a specific date.
                It provides a check that the total of all debit balances equals the total of all credit balances, ensuring
                that the books are in balance.
              </p>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-1">Types of Trial Balance:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Unadjusted Trial Balance</span> - Shows account balances before any
                    adjusting entries are made at the end of an accounting period.
                  </li>
                  <li>
                    <span className="font-medium">Adjusted Trial Balance</span> - Shows account balances after adjusting
                    entries have been made but before closing entries.
                  </li>
                  <li>
                    <span className="font-medium">Standard Trial Balance</span> - A general term that can refer to either
                    an unadjusted or adjusted trial balance, depending on when it's generated.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default TrialBalance;
