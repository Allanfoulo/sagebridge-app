
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_name: string;
  issue_date: string;
  total_amount: number;
  status: string;
  notes?: string;
}

interface PurchaseOrderDetailsProps {
  purchaseOrder: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Processing':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const PurchaseOrderDetails: React.FC<PurchaseOrderDetailsProps> = ({
  purchaseOrder,
  isOpen,
  onClose
}) => {
  if (!purchaseOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Purchase Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">PO Number</label>
              <p className="text-lg font-semibold">{purchaseOrder.order_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge variant="outline" className={getStatusColor(purchaseOrder.status)}>
                  {purchaseOrder.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Supplier Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Supplier Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Supplier Name</label>
                <p className="font-medium">{purchaseOrder.supplier_name}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Issue Date</label>
                <p>{new Date(purchaseOrder.issue_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-lg font-semibold">${purchaseOrder.total_amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {purchaseOrder.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-3">Notes</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{purchaseOrder.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderDetails;
