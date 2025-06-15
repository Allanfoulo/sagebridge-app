
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PurchaseOrderFilters from '@/components/suppliers/PurchaseOrderFilters';
import PurchaseOrderTable from '@/components/suppliers/PurchaseOrderTable';
import PurchaseOrderDetails from '@/components/suppliers/PurchaseOrderDetails';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';

interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_name: string;
  issue_date: string;
  total_amount: number;
  status: string;
  notes?: string;
}

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const {
    filteredOrders,
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    supplierFilter,
    setSupplierFilter,
    handleApplyFilters
  } = usePurchaseOrders();

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (purchaseOrder: PurchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPurchaseOrder(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2 text-sm font-medium"
        onClick={() => navigate('/suppliers')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Suppliers
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage and track purchase orders for all suppliers</p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>

      {/* Filters */}
      <PurchaseOrderFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        supplierFilter={supplierFilter}
        suppliers={suppliers}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onSupplierChange={setSupplierFilter}
        onApplyFilters={handleApplyFilters}
      />

      {/* Purchase Orders Table */}
      <PurchaseOrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      {/* Purchase Order Details Modal */}
      <PurchaseOrderDetails
        purchaseOrder={selectedPurchaseOrder}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </motion.div>
  );
};

export default PurchaseOrders;
