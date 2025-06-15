
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PurchaseOrderFiltersProps {
  searchTerm: string;
  statusFilter: string;
  supplierFilter: string;
  suppliers: { id: string; name: string }[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSupplierChange: (value: string) => void;
  onApplyFilters: () => void;
}

const PurchaseOrderFilters: React.FC<PurchaseOrderFiltersProps> = ({
  searchTerm,
  statusFilter,
  supplierFilter,
  suppliers,
  onSearchChange,
  onStatusChange,
  onSupplierChange,
  onApplyFilters
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Filters</CardTitle>
        <CardDescription>Filter and search purchase orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="grid w-full md:max-w-sm items-center gap-1.5">
            <Input 
              type="text" 
              placeholder="Search purchase orders..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="grid w-full md:max-w-sm items-center gap-1.5">
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full md:max-w-sm items-center gap-1.5">
            <Select value={supplierFilter} onValueChange={onSupplierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="w-full md:w-auto" onClick={onApplyFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderFilters;
