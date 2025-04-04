import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Search,
  Plus,
  FileUp,
  FileDown,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  CheckSquare
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const accounts = [
  {
    id: 1,
    name: 'Cash',
    number: '10001',
    category: 'Assets',
    subcategory: 'Current Assets',
    description: 'Cash on hand and in banking accounts',
    balance: 'R24,500.00',
    active: true,
    isSystem: true
  },
  {
    id: 2,
    name: 'Accounts Receivable',
    number: '10002',
    category: 'Assets',
    subcategory: 'Current Assets',
    description: 'Amounts owed by customers',
    balance: 'R18,750.00',
    active: true,
    isSystem: true
  },
  {
    id: 3,
    name: 'Inventory',
    number: '10003',
    category: 'Assets',
    subcategory: 'Current Assets',
    description: 'Goods held for sale',
    balance: 'R32,100.00',
    active: true,
    isSystem: false
  },
  {
    id: 4,
    name: 'Office Equipment',
    number: '10101',
    category: 'Assets',
    subcategory: 'Fixed Assets',
    description: 'Computers, furniture, etc.',
    balance: 'R15,800.00',
    active: true,
    isSystem: false
  },
  {
    id: 5,
    name: 'Accounts Payable',
    number: '20001',
    category: 'Liabilities',
    subcategory: 'Current Liabilities',
    description: 'Amounts owed to suppliers',
    balance: 'R12,300.00',
    active: true,
    isSystem: true
  },
  {
    id: 6,
    name: 'Salaries Payable',
    number: '20002',
    category: 'Liabilities',
    subcategory: 'Current Liabilities',
    description: 'Salaries and wages owed',
    balance: 'R8,500.00',
    active: true,
    isSystem: false
  },
  {
    id: 7,
    name: 'Long-term Loan',
    number: '20101',
    category: 'Liabilities',
    subcategory: 'Non-current Liabilities',
    description: 'Bank loan with 5-year term',
    balance: 'R75,000.00',
    active: true,
    isSystem: false
  },
  {
    id: 8,
    name: 'Share Capital',
    number: '30001',
    category: 'Equity',
    subcategory: 'Capital',
    description: 'Owner\'s investment',
    balance: 'R50,000.00',
    active: true,
    isSystem: true
  },
  {
    id: 9,
    name: 'Retained Earnings',
    number: '30002',
    category: 'Equity',
    subcategory: 'Capital',
    description: 'Accumulated profits',
    balance: 'R43,200.00',
    active: true,
    isSystem: true
  },
  {
    id: 10,
    name: 'Sales Revenue',
    number: '40001',
    category: 'Income',
    subcategory: 'Operating Revenue',
    description: 'Income from sales',
    balance: 'R124,500.00',
    active: true,
    isSystem: false
  },
  {
    id: 11,
    name: 'Interest Income',
    number: '40002',
    category: 'Income',
    subcategory: 'Non-operating Revenue',
    description: 'Income from investments',
    balance: 'R1,250.00',
    active: true,
    isSystem: false
  },
  {
    id: 12,
    name: 'Cost of Goods Sold',
    number: '50001',
    category: 'Expenses',
    subcategory: 'Cost of Sales',
    description: 'Cost of items sold',
    balance: 'R68,300.00',
    active: true,
    isSystem: false
  },
  {
    id: 13,
    name: 'Rent Expense',
    number: '50002',
    category: 'Expenses',
    subcategory: 'Operating Expenses',
    description: 'Office rental',
    balance: 'R12,000.00',
    active: true,
    isSystem: false
  },
  {
    id: 14,
    name: 'Utility Expense',
    number: '50003',
    category: 'Expenses',
    subcategory: 'Operating Expenses',
    description: 'Electricity, water, etc.',
    balance: 'R3,450.00',
    active: true,
    isSystem: false
  },
  {
    id: 15,
    name: 'Depreciation',
    number: '50004',
    category: 'Expenses',
    subcategory: 'Non-cash Expenses',
    description: 'Depreciation of fixed assets',
    balance: 'R5,200.00',
    active: true,
    isSystem: true
  },
];

const ChartOfAccounts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const filteredAccounts = accounts
    .filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.number.includes(searchTerm) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(account => 
      selectedCategory ? account.category === selectedCategory : true
    );
  
  const groupedAccounts: Record<string, typeof accounts> = {};
  filteredAccounts.forEach(account => {
    if (!groupedAccounts[account.category]) {
      groupedAccounts[account.category] = [];
    }
    groupedAccounts[account.category].push(account);
  });
  
  const toggleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredAccounts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAccounts.map(account => account.id));
    }
  };

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
            className="text-sage-blue hover:text-sage-blue/90 hover:bg-sage-blue/10 flex items-center gap-2 text-sm font-medium"
            onClick={() => navigate('/accounting')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Accounting
          </Button>
        </div>
        
        <div className="bg-sage-blue rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-white mb-2">Chart of Accounts</h1>
          <p className="text-white/80">Manage your list of financial accounts and categories</p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">List of Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search accounts..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Assets">Assets</SelectItem>
                    <SelectItem value="Liabilities">Liabilities</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expenses">Expenses</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter size={16} />
                </Button>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" className="gap-1">
                  <FileDown size={16} />
                  Export
                </Button>
                <Button variant="outline" className="gap-1">
                  <FileUp size={16} />
                  Import
                </Button>
                <Button className="gap-1" onClick={() => navigate('/accounting/add-account')}>
                  <Plus size={16} />
                  Add Account
                </Button>
              </div>
            </div>
            
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2 mb-4 p-2 bg-sage-lightGray rounded-md">
                <CheckSquare size={16} className="text-sage-blue" />
                <span className="text-sm font-medium">{selectedRows.length} accounts selected</span>
                <div className="flex-1"></div>
                <Button variant="ghost" size="sm" className="text-sage-blue hover:bg-sage-blue/10">
                  Export Selected
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                  Delete Selected
                </Button>
              </div>
            )}
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sage-lightGray">
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedRows.length === filteredAccounts.length && filteredAccounts.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[100px]">Account #</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[150px]">Category</TableHead>
                    <TableHead className="text-right w-[150px]">Balance</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                
                {Object.keys(groupedAccounts).map(category => (
                  <React.Fragment key={category}>
                    <TableBody>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableCell colSpan={8} className="font-medium">
                          {category} ({groupedAccounts[category].length})
                        </TableCell>
                      </TableRow>
                      
                      {groupedAccounts[category].map(account => (
                        <TableRow 
                          key={account.id}
                          className={selectedRows.includes(account.id) ? 'bg-blue-50' : ''}
                        >
                          <TableCell>
                            <Checkbox 
                              checked={selectedRows.includes(account.id)}
                              onCheckedChange={() => toggleSelectRow(account.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono">{account.number}</TableCell>
                          <TableCell>
                            <div className="font-medium hover:text-sage-blue cursor-pointer" onClick={() => navigate(`/accounting/account/${account.id}`)}>
                              {account.name}
                            </div>
                            <div className="text-xs text-muted-foreground">{account.subcategory}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{account.description}</TableCell>
                          <TableCell>{account.category}</TableCell>
                          <TableCell className="text-right font-mono">{account.balance}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${account.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {account.active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/accounting/account/${account.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={account.isSystem}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  disabled={account.isSystem} 
                                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </React.Fragment>
                ))}
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default ChartOfAccounts;
