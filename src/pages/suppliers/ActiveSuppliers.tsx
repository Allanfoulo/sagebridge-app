
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import SuppliersTable from '@/components/suppliers/SuppliersTable';
import SupplierFilters from '@/components/suppliers/SupplierFilters';
import SupplierPagination from '@/components/suppliers/SupplierPagination';
import SupplierBulkActions from '@/components/suppliers/SupplierBulkActions';
import useSuppliers from '@/hooks/useSuppliers';

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
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    selectedSuppliers,
    paginatedSuppliers,
    requestSort,
    toggleSelectAll,
    toggleSelectSupplier,
    itemsPerPage,
    totalPages,
    uniqueCategories,
    filteredSuppliers
  } = useSuppliers({ initialData: supplierData });

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
        <SupplierFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={uniqueCategories}
          isActiveView={true}
        />

        {/* Bulk Actions Bar */}
        <SupplierBulkActions 
          selectedCount={selectedSuppliers.length}
          isActiveView={true}
        />

        {/* Suppliers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <SuppliersTable
            suppliers={paginatedSuppliers}
            selectedSuppliers={selectedSuppliers}
            toggleSelectAll={toggleSelectAll}
            toggleSelectSupplier={toggleSelectSupplier}
            requestSort={requestSort}
            isActiveView={true}
          />

          {/* Pagination */}
          <SupplierPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            filteredCount={filteredSuppliers.length}
            itemName="active suppliers"
          />
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ActiveSuppliers;
