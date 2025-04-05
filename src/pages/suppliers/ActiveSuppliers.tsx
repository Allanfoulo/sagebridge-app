
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ArrowUpDown, Download, Upload, MoreHorizontal, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import MainLayout from '@/components/layout/MainLayout';

// Mock data for suppliers - filtered for active suppliers only
const supplierData = [
  {
    id: 'SP001',
    name: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    phone: '(555) 123-4567',
    email: 'john@techsolutions.com',
    address: '123 Tech Lane, Silicon Valley, CA',
    status: 'Active',
    category: 'Technology',
    balance: 12500.00
  },
  {
    id: 'SP002',
    name: 'Office Supplies Co.',
    contactPerson: 'Sarah Johnson',
    phone: '(555) 234-5678',
    email: 'sarah@officesupplies.com',
    address: '456 Supply Road, Chicago, IL',
    status: 'Active',
    category: 'Office Supplies',
    balance: 3750.50
  },
  {
    id: 'SP004',
    name: 'Fresh Foods Distributors',
    contactPerson: 'Emily Rodriguez',
    phone: '(555) 456-7890',
    email: 'emily@freshfoods.com',
    address: '101 Produce Lane, Farmington, OR',
    status: 'Active',
    category: 'Food & Beverage',
    balance: 6300.25
  },
  {
    id: 'SP005',
    name: 'Industrial Parts Ltd.',
    contactPerson: 'Robert Kim',
    phone: '(555) 567-8901',
    email: 'robert@industrialparts.com',
    address: '202 Factory Road, Detroit, MI',
    status: 'Active',
    category: 'Manufacturing',
    balance: 15700.80
  },
  {
    id: 'SP007',
    name: 'Construction Experts Inc.',
    contactPerson: 'David Wilson',
    phone: '(555) 789-0123',
    email: 'david@constructionexperts.com',
    address: '404 Builder Street, Phoenix, AZ',
    status: 'Active',
    category: 'Construction',
    balance: 22300.60
  },
  {
    id: 'SP008',
    name: 'Medical Supplies Co.',
    contactPerson: 'Lisa Brown',
    phone: '(555) 890-1234',
    email: 'lisa@medicalsupplies.com',
    address: '505 Health Drive, Boston, MA',
    status: 'Active',
    category: 'Healthcare',
    balance: 9800.40
  }
];

const ActiveSuppliers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({ key: 'name', direction: null });

  // Filter suppliers based on search and category
  const filteredSuppliers = supplierData.filter(supplier => {
    const matchesSearch = searchTerm === '' || 
      Object.values(supplier).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortConfig.direction === null) {
      return 0;
    }
    
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

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // Handle bulk selection
  const toggleSelectAll = () => {
    if (selectedSuppliers.length === paginatedSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(paginatedSuppliers.map(supplier => supplier.id));
    }
  };

  const toggleSelectSupplier = (id: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) 
        ? prev.filter(supplierId => supplierId !== id)
        : [...prev, id]
    );
  };

  // Render status badge
  const renderStatus = (status: string) => {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">Active Suppliers</h1>
              <p className="text-white/80">View and manage your active supplier accounts</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary"
                className="bg-white text-green-600 hover:bg-white/90 shadow"
                onClick={() => navigate('/suppliers')}
              >
                Back to Menu
              </Button>
              <Button 
                className="bg-white text-green-600 hover:bg-white/90 shadow"
                onClick={() => navigate('/suppliers/add')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search active suppliers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions Bar - Only show if suppliers are selected */}
        {selectedSuppliers.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedSuppliers.length} supplier{selectedSuppliers.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Export Selected
              </Button>
              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                Mark Inactive
              </Button>
              <Button size="sm" variant="outline">
                Bulk Edit
              </Button>
            </div>
          </div>
        )}

        {/* Suppliers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedSuppliers.length === paginatedSuppliers.length && paginatedSuppliers.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all suppliers"
                  />
                </TableHead>
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
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown className="ml-1 h-3 w-3" />
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
              {paginatedSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No active suppliers found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSuppliers.map((supplier) => (
                  <TableRow 
                    key={supplier.id}
                    className={selectedSuppliers.includes(supplier.id) ? "bg-green-50" : ""}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedSuppliers.includes(supplier.id)} 
                        onCheckedChange={() => toggleSelectSupplier(supplier.id)}
                        aria-label={`Select ${supplier.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{supplier.id}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={supplier.address}>
                      {supplier.address}
                    </TableCell>
                    <TableCell>{renderStatus(supplier.status)}</TableCell>
                    <TableCell>{supplier.category}</TableCell>
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
                          <DropdownMenuItem className="text-red-600">
                            Mark as Inactive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{Math.min(1 + (currentPage - 1) * itemsPerPage, filteredSuppliers.length)}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredSuppliers.length)}</strong> of <strong>{filteredSuppliers.length}</strong> active suppliers
            </div>
            <Pagination>
              <PaginationContent>
                {currentPage > 1 ? (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    />
                  </PaginationItem>
                ) : (
                  <PaginationItem>
                    <PaginationPrevious
                      className="pointer-events-none opacity-50"
                      onClick={() => {}}
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages ? (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    />
                  </PaginationItem>
                ) : (
                  <PaginationItem>
                    <PaginationNext
                      className="pointer-events-none opacity-50"
                      onClick={() => {}}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ActiveSuppliers;
