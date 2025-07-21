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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [editingAccount, setEditingAccount] = useState<typeof accounts[0] | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<typeof accounts[0] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    number: '',
    name: '',
    description: '',
    category: '',
    subcategory: '',
    active: true
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    number: '',
    description: '',
    category: '',
    subcategory: '',
    active: true
  });
  
  const filteredAccounts = accounts
    .filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.number.includes(searchTerm) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(account => 
      selectedCategory ? account.category === selectedCategory : true
    )
    .filter(account => 
      selectedSubcategory ? account.subcategory === selectedSubcategory : true
    );
  
  // Get unique subcategories for the selected category
  const availableSubcategories = selectedCategory 
    ? [...new Set(accounts.filter(account => account.category === selectedCategory).map(account => account.subcategory))]
    : [...new Set(accounts.map(account => account.subcategory))];

  // Reset subcategory when category changes
  React.useEffect(() => {
    setSelectedSubcategory('');
  }, [selectedCategory]);
  
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

  const handleEditAccount = (account: typeof accounts[0]) => {
    setEditingAccount(account);
    setEditForm({
      name: account.name,
      number: account.number,
      description: account.description,
      category: account.category,
      subcategory: account.subcategory,
      active: account.active
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAccount) return;
    
    try {
      // TODO: Replace with actual Supabase update call
      // await supabase
      //   .from('chart_of_accounts')
      //   .update({
      //     name: editForm.name,
      //     account_number: editForm.number,
      //     description: editForm.description,
      //     type: editForm.category,
      //     subcategory: editForm.subcategory,
      //     is_active: editForm.active
      //   })
      //   .eq('id', editingAccount.id);
      
      // For now, just show success message
      toast({
        title: "Account Updated",
        description: `Account "${editForm.name}" has been updated successfully.`,
      });
      
      setIsEditDialogOpen(false);
      setEditingAccount(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = (account: typeof accounts[0]) => {
    setDeletingAccount(account);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingAccount) return;
    
    try {
      // TODO: Replace with actual Supabase delete call
      // await supabase
      //   .from('chart_of_accounts')
      //   .delete()
      //   .eq('id', deletingAccount.id);
      
      // For now, just show success message
      toast({
        title: "Account Deleted",
        description: `Account "${deletingAccount.name}" has been deleted successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
      setDeletingAccount(null);
      // Remove from selected rows if it was selected
      setSelectedRows(prev => prev.filter(id => id !== deletingAccount.id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    try {
      // TODO: Replace with actual Supabase bulk delete call
      // await supabase
      //   .from('chart_of_accounts')
      //   .delete()
      //   .in('id', selectedRows);
      
      // For now, just show success message
      toast({
        title: "Accounts Deleted",
        description: `${selectedRows.length} accounts have been deleted successfully.`,
      });
      
      setSelectedRows([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete accounts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportAccounts = () => {
    try {
      const exportData = filteredAccounts.map(account => ({
        'Account Number': account.number,
        'Account Name': account.name,
        'Description': account.description,
        'Category': account.category,
        'Subcategory': account.subcategory,
        'Balance': account.balance,
        'Status': account.active ? 'Active' : 'Inactive',
        'System Account': account.isSystem ? 'Yes' : 'No'
      }));
      
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `chart-of-accounts-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: `${exportData.length} accounts exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export accounts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportSelected = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select accounts to export.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const selectedAccounts = accounts.filter(account => selectedRows.includes(account.id));
      const exportData = selectedAccounts.map(account => ({
        'Account Number': account.number,
        'Account Name': account.name,
        'Description': account.description,
        'Category': account.category,
        'Subcategory': account.subcategory,
        'Balance': account.balance,
        'Status': account.active ? 'Active' : 'Inactive',
        'System Account': account.isSystem ? 'Yes' : 'No'
      }));
      
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `selected-accounts-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: `${selectedAccounts.length} selected accounts exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export selected accounts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImportAccounts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
          
          // TODO: Parse CSV and validate data
          // TODO: Replace with actual Supabase bulk insert
          
          toast({
            title: "Import Started",
            description: "Account import functionality will be implemented with database integration.",
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Failed to parse CSV file. Please check the format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleToggleAccountStatus = async (account: typeof accounts[0]) => {
    if (account.isSystem) {
      toast({
        title: "Cannot Modify",
        description: "System accounts cannot be deactivated.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // TODO: Replace with actual Supabase update call
      // await supabase
      //   .from('chart_of_accounts')
      //   .update({ is_active: !account.active })
      //   .eq('id', account.id);
      
      toast({
        title: "Status Updated",
        description: `Account "${account.name}" has been ${account.active ? 'deactivated' : 'activated'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusChange = async (status: boolean) => {
    if (selectedRows.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select accounts to modify.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedAccounts = accounts.filter(account => selectedRows.includes(account.id));
    const systemAccounts = selectedAccounts.filter(account => account.isSystem);
    
    if (systemAccounts.length > 0) {
      toast({
        title: "Cannot Modify System Accounts",
        description: `${systemAccounts.length} system accounts cannot be modified. Only non-system accounts will be updated.`,
        variant: "destructive",
      });
    }
    
    const modifiableAccounts = selectedAccounts.filter(account => !account.isSystem);
    
    if (modifiableAccounts.length === 0) {
      return;
    }
    
    try {
      // TODO: Replace with actual Supabase bulk update call
      // await supabase
      //   .from('chart_of_accounts')
      //   .update({ is_active: status })
      //   .in('id', modifiableAccounts.map(account => account.id));
      
      toast({
        title: "Status Updated",
        description: `${modifiableAccounts.length} accounts have been ${status ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account statuses. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.number || !newAccount.name || !newAccount.category || !newAccount.subcategory) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if account number already exists
    if (accounts.some(account => account.number === newAccount.number)) {
      toast({
        title: "Duplicate Account Number",
        description: "An account with this number already exists.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // TODO: Replace with actual Supabase insert call
      // await supabase
      //   .from('chart_of_accounts')
      //   .insert([{
      //     account_number: newAccount.number,
      //     account_name: newAccount.name,
      //     description: newAccount.description,
      //     category: newAccount.category,
      //     subcategory: newAccount.subcategory,
      //     is_active: newAccount.active,
      //     is_system: false
      //   }]);
      
      toast({
        title: "Account Added",
        description: `Account "${newAccount.name}" has been created successfully.`,
      });
      
      setShowAddDialog(false);
      setNewAccount({
        number: '',
        name: '',
        description: '',
        category: '',
        subcategory: '',
        active: true
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSubcategoriesForCategory = (category: string) => {
    const subcategoryMap: Record<string, string[]> = {
      'Assets': ['Current Assets', 'Fixed Assets', 'Other Assets'],
      'Liabilities': ['Current Liabilities', 'Long-term Liabilities'],
      'Equity': ['Owner\'s Equity', 'Retained Earnings'],
      'Revenue': ['Operating Revenue', 'Other Revenue'],
      'Expenses': ['Operating Expenses', 'Administrative Expenses', 'Other Expenses']
    };
    return subcategoryMap[category] || [];
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
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Assets">Assets</SelectItem>
                    <SelectItem value="Liabilities">Liabilities</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expenses">Expenses</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subcategories</SelectItem>
                    {availableSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Filter size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkStatusChange(true)}>
                      Activate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange(false)}>
                      Deactivate Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" className="gap-1" onClick={handleExportAccounts}>
                  <FileDown size={16} />
                  Export
                </Button>
                <Button variant="outline" className="gap-1" onClick={handleImportAccounts}>
                  <FileUp size={16} />
                  Import
                </Button>
                <Button className="gap-1" onClick={() => setShowAddDialog(true)}>
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
                <Button variant="ghost" size="sm" className="text-sage-blue hover:bg-sage-blue/10" onClick={handleExportSelected}>
                  Export Selected
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleBulkDelete}
                >
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
                                <DropdownMenuItem 
                                  disabled={account.isSystem}
                                  onClick={() => !account.isSystem && handleEditAccount(account)}
                                >
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  disabled={account.isSystem}
                                  onClick={() => !account.isSystem && handleToggleAccountStatus(account)}
                                >
                                  {account.active ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  disabled={account.isSystem} 
                                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                  onClick={() => !account.isSystem && handleDeleteAccount(account)}
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

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Make changes to the account details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-number" className="text-right">
                Account #
              </Label>
              <Input
                id="account-number"
                value={editForm.number}
                onChange={(e) => setEditForm(prev => ({ ...prev, number: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-name" className="text-right">
                Name
              </Label>
              <Input
                id="account-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-description" className="text-right">
                Description
              </Label>
              <Input
                id="account-description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-category" className="text-right">
                Category
              </Label>
              <Select value={editForm.category} onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assets">Assets</SelectItem>
                  <SelectItem value="Liabilities">Liabilities</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expenses">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-subcategory" className="text-right">
                Subcategory
              </Label>
              <Input
                id="account-subcategory"
                value={editForm.subcategory}
                onChange={(e) => setEditForm(prev => ({ ...prev, subcategory: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account-status" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="account-status"
                  checked={editForm.active}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, active: checked as boolean }))}
                />
                <Label htmlFor="account-status">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account "{deletingAccount?.name}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Account Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Create a new account in your chart of accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-account-number" className="text-right">
                Account # *
              </Label>
              <Input
                id="new-account-number"
                value={newAccount.number}
                onChange={(e) => setNewAccount(prev => ({ ...prev, number: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., 10001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-account-name" className="text-right">
                Name *
              </Label>
              <Input
                id="new-account-name"
                value={newAccount.name}
                onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Account name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-account-description" className="text-right">
                Description
              </Label>
              <Input
                id="new-account-description"
                value={newAccount.description}
                onChange={(e) => setNewAccount(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                placeholder="Account description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-account-category" className="text-right">
                Category *
              </Label>
              <Select 
                value={newAccount.category} 
                onValueChange={(value) => setNewAccount(prev => ({ ...prev, category: value, subcategory: '' }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assets">Assets</SelectItem>
                  <SelectItem value="Liabilities">Liabilities</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expenses">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-account-subcategory" className="text-right">
                Subcategory *
              </Label>
              <Select 
                value={newAccount.subcategory} 
                onValueChange={(value) => setNewAccount(prev => ({ ...prev, subcategory: value }))}
                disabled={!newAccount.category}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {getSubcategoriesForCategory(newAccount.category).map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-account-status" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="new-account-status"
                  checked={newAccount.active}
                  onCheckedChange={(checked) => setNewAccount(prev => ({ ...prev, active: checked as boolean }))}
                />
                <Label htmlFor="new-account-status">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAccount}>
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ChartOfAccounts;
