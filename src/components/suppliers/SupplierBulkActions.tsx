
import React from 'react';
import { Button } from '@/components/ui/button';

interface SupplierBulkActionsProps {
  selectedCount: number;
  isActiveView: boolean;
}

const SupplierBulkActions: React.FC<SupplierBulkActionsProps> = ({
  selectedCount,
  isActiveView
}) => {
  if (selectedCount === 0) return null;
  
  const bgColor = isActiveView ? "bg-green-50" : "bg-red-50";
  const borderColor = isActiveView ? "border-green-200" : "border-red-200";
  
  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-3 flex items-center justify-between`}>
      <span className="text-sm font-medium">
        {selectedCount} supplier{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          Export Selected
        </Button>
        {isActiveView ? (
          <>
            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
              Mark Inactive
            </Button>
            <Button size="sm" variant="outline">
              Bulk Edit
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-800">
              Reactivate
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-800">
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierBulkActions;
