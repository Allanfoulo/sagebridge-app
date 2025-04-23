
import React from 'react';
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Supplier } from '@/hooks/useSuppliers';

interface SuppliersTableProps {
  suppliers: Supplier[];
  selectedSuppliers: string[];
  toggleSelectAll: () => void;
  toggleSelectSupplier: (id: string) => void;
  requestSort: (key: string) => void;
  isActiveView: boolean;
  isLoading?: boolean;
}

const SuppliersTable: React.FC<SuppliersTableProps> = ({
  suppliers,
  selectedSuppliers,
  toggleSelectAll,
  toggleSelectSupplier,
  requestSort,
  isActiveView,
  isLoading = false
}) => {
  // Render status badge
  const renderStatus = (isActive: boolean) => {
    if (isActive) {
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

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={10} className="text-center py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3">Loading suppliers...</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox 
              checked={selectedSuppliers.length === suppliers.length && suppliers.length > 0}
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
          {isActiveView && <TableHead>Phone</TableHead>}
          <TableHead>Email</TableHead>
          {isActiveView && <TableHead>Location</TableHead>}
          <TableHead>Status</TableHead>
          {isActiveView && 
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('category')}
            >
              <div className="flex items-center">
                Category
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </div>
            </TableHead>
          }
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
              No suppliers found matching your criteria.
            </TableCell>
          </TableRow>
        ) : (
          suppliers.map((supplier) => (
            <TableRow 
              key={supplier.id}
              className={selectedSuppliers.includes(supplier.id) ? "bg-sage-blue/5" : ""}
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
              <TableCell>{supplier.contact_person}</TableCell>
              {isActiveView && <TableCell>{supplier.phone}</TableCell>}
              <TableCell>{supplier.email}</TableCell>
              {isActiveView && 
                <TableCell className="max-w-[200px] truncate" title={supplier.address}>
                  {supplier.address}
                </TableCell>
              }
              <TableCell>{renderStatus(supplier.is_active)}</TableCell>
              {isActiveView && <TableCell>{supplier.category}</TableCell>}
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
                      {supplier.is_active ? 'Mark as Inactive' : 'Reactivate'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SuppliersTable;
