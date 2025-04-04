
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Search,
  Plus,
  FileUp,
  Printer,
  ArrowLeft,
  CheckSquare,
  Filter,
  ChevronDown
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Sample journal entries data
const journalEntries = [
  {
    id: 1001,
    date: '2023-06-01',
    reference: 'JE-1001',
    description: 'June rent payment',
    effect: 'Debit',
    account: 'Rent Expense',
    amount: 'R3,500.00',
    affectingAccount: 'Cash',
    status: 'draft',
  },
  {
    id: 1002,
    date: '2023-06-05',
    reference: 'JE-1002',
    description: 'Purchase of office supplies',
    effect: 'Debit',
    account: 'Office Supplies',
    amount: 'R750.00',
    affectingAccount: 'Cash',
    status: 'draft',
  },
  {
    id: 1003,
    date: '2023-06-10',
    reference: 'JE-1003',
    description: 'Client invoice payment',
    effect: 'Debit',
    account: 'Cash',
    amount: 'R2,500.00',
    affectingAccount: 'Accounts Receivable',
    status: 'draft',
  },
  {
    id: 1004,
    date: '2023-05-28',
    reference: 'JE-1004',
    description: 'Salaries payment',
    effect: 'Debit',
    account: 'Salaries Expense',
    amount: 'R8,500.00',
    affectingAccount: 'Cash',
    status: 'reviewed',
  },
  {
    id: 1005,
    date: '2023-05-25',
    reference: 'JE-1005',
    description: 'Utility bills',
    effect: 'Debit',
    account: 'Utility Expense',
    amount: 'R1,250.00',
    affectingAccount: 'Cash',
    status: 'reviewed',
  },
  {
    id: 1006,
    date: '2023-05-20',
    reference: 'JE-1006',
    description: 'Loan repayment',
    effect: 'Debit',
    account: 'Long-term Loan',
    amount: 'R1,500.00',
    affectingAccount: 'Cash',
    status: 'reviewed',
  },
  {
    id: 1007,
    date: '2023-05-15',
    reference: 'JE-1007',
    description: 'Sales revenue',
    effect: 'Credit',
    account: 'Sales Revenue',
    amount: 'R5,250.00',
    affectingAccount: 'Cash',
    status: 'posted',
  },
  {
    id: 1008,
    date: '2023-05-10',
    reference: 'JE-1008',
    description: 'Asset depreciation',
    effect: 'Debit',
    account: 'Depreciation Expense',
    amount: 'R850.00',
    affectingAccount: 'Accumulated Depreciation',
    status: 'posted',
  },
];

const Journals = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('new');
  
  // Filter journal entries based on search term and active tab
  const filteredJournals = journalEntries
    .filter(journal => 
      journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.account.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(journal => {
      if (activeTab === 'new') return journal.status === 'draft';
      if (activeTab === 'reviewed') return journal.status === 'reviewed';
      if (activeTab === 'posted') return journal.status === 'posted';
      return true;
    });
  
  const toggleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredJournals.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredJournals.map(journal => journal.id));
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'reviewed':
        return <Badge variant="secondary">Reviewed</Badge>;
      case 'posted':
        return <Badge variant="default">Posted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
          <h1 className="text-2xl font-semibold text-white mb-2">Journal Entries</h1>
          <p className="text-white/80">Create and manage journal transactions</p>
        </div>
        
        {/* Journal Entries List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Process Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="new" onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <TabsList className="mb-0">
                  <TabsTrigger value="new">New Journals</TabsTrigger>
                  <TabsTrigger value="reviewed">Reviewed Journals</TabsTrigger>
                  <TabsTrigger value="posted">Posted Journals</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" className="gap-1">
                    <FileUp size={16} />
                    Import
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Printer size={16} />
                    Print
                  </Button>
                  <Button className="gap-1" onClick={() => navigate('/accounting/journals/new')}>
                    <Plus size={16} />
                    New Journal
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search journals..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter size={16} />
                </Button>
              </div>
              
              {/* Batch Actions */}
              {selectedRows.length > 0 && (
                <div className="flex items-center gap-2 mb-4 p-2 bg-sage-lightGray rounded-md">
                  <CheckSquare size={16} className="text-sage-blue" />
                  <span className="text-sm font-medium">{selectedRows.length} entries selected</span>
                  <div className="flex-1"></div>
                  
                  {activeTab === 'new' && (
                    <Button variant="ghost" size="sm" className="text-sage-blue hover:bg-sage-blue/10">
                      Mark as Reviewed
                    </Button>
                  )}
                  
                  {activeTab === 'reviewed' && (
                    <Button variant="ghost" size="sm" className="text-sage-blue hover:bg-sage-blue/10">
                      Post Entries
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    Delete
                  </Button>
                </div>
              )}
              
              <TabsContent value="new" className="m-0">
                {renderJournalTable(filteredJournals, selectedRows, toggleSelectRow, toggleSelectAll, getStatusBadge)}
              </TabsContent>
              
              <TabsContent value="reviewed" className="m-0">
                {renderJournalTable(filteredJournals, selectedRows, toggleSelectRow, toggleSelectAll, getStatusBadge)}
              </TabsContent>
              
              <TabsContent value="posted" className="m-0">
                {renderJournalTable(filteredJournals, selectedRows, toggleSelectRow, toggleSelectAll, getStatusBadge)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Journal Workflow Explanation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Understanding Journal Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <h3 className="font-medium">1. New Journals</h3>
                <p className="text-sm text-muted-foreground">
                  Journal entries start as drafts. These are transactions that have been recorded but not yet verified.
                  In this stage, entries can be freely edited or deleted.
                </p>
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="font-medium">2. Reviewed Journals</h3>
                <p className="text-sm text-muted-foreground">
                  After verification, journals are marked as reviewed. This indicates that the entries have been 
                  checked and approved, but are not yet permanently recorded in the general ledger.
                </p>
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="font-medium">3. Posted Journals</h3>
                <p className="text-sm text-muted-foreground">
                  Once posted, journal entries are permanently recorded in the general ledger and affect account balances.
                  Posted entries cannot be deleted, only reversed with a new correcting entry.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

function renderJournalTable(
  journals: typeof journalEntries,
  selectedRows: number[],
  toggleSelectRow: (id: number) => void,
  toggleSelectAll: () => void,
  getStatusBadge: (status: string) => React.ReactNode
) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-sage-lightGray">
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectedRows.length === journals.length && journals.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[120px]">Reference</TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
            <TableHead className="w-[100px]">Effect</TableHead>
            <TableHead className="min-w-[150px]">Account</TableHead>
            <TableHead className="text-right w-[120px]">Amount</TableHead>
            <TableHead className="min-w-[150px]">Affecting Account</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {journals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                No journal entries found
              </TableCell>
            </TableRow>
          ) : (
            journals.map(journal => (
              <TableRow 
                key={journal.id}
                className={selectedRows.includes(journal.id) ? 'bg-blue-50' : ''}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.includes(journal.id)}
                    onCheckedChange={() => toggleSelectRow(journal.id)}
                  />
                </TableCell>
                <TableCell>{journal.date}</TableCell>
                <TableCell>{journal.reference}</TableCell>
                <TableCell className="font-medium cursor-pointer hover:text-sage-blue">
                  {journal.description}
                </TableCell>
                <TableCell>{journal.effect}</TableCell>
                <TableCell>{journal.account}</TableCell>
                <TableCell className="text-right font-mono">{journal.amount}</TableCell>
                <TableCell>{journal.affectingAccount}</TableCell>
                <TableCell>{getStatusBadge(journal.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Journals;
