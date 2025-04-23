
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
    filteredSuppliers,
    isLoading
  } = useSuppliers();

  // Filter for active suppliers only
  const activeSuppliers = paginatedSuppliers.filter(supplier => supplier.is_active);

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
            suppliers={activeSuppliers}
            selectedSuppliers={selectedSuppliers}
            toggleSelectAll={toggleSelectAll}
            toggleSelectSupplier={toggleSelectSupplier}
            requestSort={requestSort}
            isActiveView={true}
            isLoading={isLoading}
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
