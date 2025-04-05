
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Plus, ArrowUpDown, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock data for suppliers by category
const suppliersByCategory = [
  {
    category: 'Technology',
    suppliers: [
      {
        id: 'SP001',
        name: 'Tech Solutions Inc.',
        contactPerson: 'John Smith',
        phone: '(555) 123-4567',
        email: 'john@techsolutions.com',
        status: 'Active',
        balance: 12500.00
      },
      {
        id: 'SP009',
        name: 'Electronics Wholesale Corp.',
        contactPerson: 'Kevin Zhang',
        phone: '(555) 234-5678',
        email: 'kevin@electronicswhsl.com',
        status: 'Inactive',
        balance: 7850.25
      }
    ]
  },
  {
    category: 'Office Supplies',
    suppliers: [
      {
        id: 'SP002',
        name: 'Office Supplies Co.',
        contactPerson: 'Sarah Johnson',
        phone: '(555) 234-5678',
        email: 'sarah@officesupplies.com',
        status: 'Active',
        balance: 3750.50
      },
      {
        id: 'SP012',
        name: 'Furniture Depot Ltd.',
        contactPerson: 'Jessica Taylor',
        phone: '(555) 345-6789',
        email: 'jessica@furnituredepot.com',
        status: 'Inactive',
        balance: 2340.60
      }
    ]
  },
  {
    category: 'Logistics',
    suppliers: [
      {
        id: 'SP003',
        name: 'Global Shipping LLC',
        contactPerson: 'Michael Chen',
        phone: '(555) 345-6789',
        email: 'michael@globalshipping.com',
        status: 'Inactive',
        balance: 8200.75
      }
    ]
  },
  {
    category: 'Food & Beverage',
    suppliers: [
      {
        id: 'SP004',
        name: 'Fresh Foods Distributors',
        contactPerson: 'Emily Rodriguez',
        phone: '(555) 456-7890',
        email: 'emily@freshfoods.com',
        status: 'Active',
        balance: 6300.25
      }
    ]
  },
  {
    category: 'Manufacturing',
    suppliers: [
      {
        id: 'SP005',
        name: 'Industrial Parts Ltd.',
        contactPerson: 'Robert Kim',
        phone: '(555) 567-8901',
        email: 'robert@industrialparts.com',
        status: 'Active',
        balance: 15700.80
      }
    ]
  },
  {
    category: 'Services',
    suppliers: [
      {
        id: 'SP006',
        name: 'Creative Designs Agency',
        contactPerson: 'Amanda Lee',
        phone: '(555) 678-9012',
        email: 'amanda@creativedesigns.com',
        status: 'Inactive',
        balance: 4200.30
      }
    ]
  },
  {
    category: 'Construction',
    suppliers: [
      {
        id: 'SP007',
        name: 'Construction Experts Inc.',
        contactPerson: 'David Wilson',
        phone: '(555) 789-0123',
        email: 'david@constructionexperts.com',
        status: 'Active',
        balance: 22300.60
      }
    ]
  },
  {
    category: 'Healthcare',
    suppliers: [
      {
        id: 'SP008',
        name: 'Medical Supplies Co.',
        contactPerson: 'Lisa Brown',
        phone: '(555) 890-1234',
        email: 'lisa@medicalsupplies.com',
        status: 'Active',
        balance: 9800.40
      }
    ]
  }
];

const SuppliersByCategory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<string[]>(suppliersByCategory.map(c => c.category));
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: 'name', direction: null });

  // Filter suppliers based on search term
  const filteredCategories = suppliersByCategory
    .map(category => {
      const filteredSuppliers = category.suppliers.filter(supplier => 
        Object.values(supplier).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      return {
        ...category,
        suppliers: filteredSuppliers
      };
    })
    .filter(category => category.suppliers.length > 0);

  // Toggle category open/close
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle all categories
  const toggleAllCategories = () => {
    if (openCategories.length === filteredCategories.length) {
      setOpenCategories([]);
    } else {
      setOpenCategories(filteredCategories.map(c => c.category));
    }
  };

  // Sort suppliers within each category
  const sortedCategories = filteredCategories.map(category => {
    if (sortConfig.direction === null) {
      return category;
    }

    const sortedSuppliers = [...category.suppliers].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return {
      ...category,
      suppliers: sortedSuppliers
    };
  });

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  // Render status badge
  const renderStatus = (status: string) => {
    if (status === 'Active') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      );
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">Suppliers by Category</h1>
              <p className="text-white/80">View and manage your suppliers organized by category</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-white/90 shadow"
                onClick={() => navigate('/suppliers')}
              >
                Back to Menu
              </Button>
              <Button 
                className="bg-white text-purple-600 hover:bg-white/90 shadow"
                onClick={() => navigate('/suppliers/add')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers across all categories..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={toggleAllCategories}
            >
              {openCategories.length === filteredCategories.length ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-6">
          {sortedCategories.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-muted-foreground">No suppliers found matching your search criteria.</p>
            </div>
          ) : (
            sortedCategories.map((category) => (
              <Collapsible
                key={category.category}
                open={openCategories.includes(category.category)}
                onOpenChange={() => toggleCategory(category.category)}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 border-b"
                  >
                    <div className="flex items-center space-x-2">
                      {openCategories.includes(category.category) ? (
                        <ChevronDown className="h-5 w-5 text-purple-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-purple-600" />
                      )}
                      <h3 className="text-lg font-medium text-gray-900">{category.category}</h3>
                      <Badge variant="outline" className="ml-2">{category.suppliers.length}</Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">
                        {category.suppliers.filter(s => s.status === 'Active').length} active
                      </span>
                      |
                      <span className="ml-2">
                        {category.suppliers.filter(s => s.status === 'Inactive').length} inactive
                      </span>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => requestSort('id')}
                        >
                          <div className="flex items-center">
                            ID
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => requestSort('name')}
                        >
                          <div className="flex items-center">
                            Supplier Name
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Status
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => requestSort('balance')}
                        >
                          <div className="flex items-center">
                            Balance
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.suppliers.map(supplier => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.id}</TableCell>
                          <TableCell>{supplier.name}</TableCell>
                          <TableCell>{supplier.contactPerson}</TableCell>
                          <TableCell>{supplier.email}</TableCell>
                          <TableCell>{renderStatus(supplier.status)}</TableCell>
                          <TableCell className="font-mono">
                            ${supplier.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                                <DropdownMenuItem>View Transactions</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {supplier.status === 'Active' ? (
                                  <DropdownMenuItem className="text-red-600">
                                    Mark as Inactive
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-green-600">
                                    Reactivate
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default SuppliersByCategory;
