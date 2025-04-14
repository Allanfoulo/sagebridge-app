
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface Supplier {
  id: string;
  name: string;
}

interface InvoiceSupplierSectionProps {
  suppliers: Supplier[];
  supplierId: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  status: string;
  onSupplierChange: (value: string) => void;
  onIssueDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const InvoiceSupplierSection: React.FC<InvoiceSupplierSectionProps> = ({
  suppliers,
  supplierId,
  issueDate,
  dueDate,
  invoiceNumber,
  status,
  onSupplierChange,
  onIssueDateChange,
  onDueDateChange,
  onStatusChange
}) => {
  const navigate = useNavigate();

  const handleAddNewSupplier = () => {
    navigate(`/suppliers/add?returnTo=${encodeURIComponent('/purchases/new-invoice')}`);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddNewSupplier}
                className="h-8"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                New
              </Button>
            </div>
            <Select 
              value={supplierId} 
              onValueChange={onSupplierChange}
            >
              <SelectTrigger id="supplier">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.length === 0 && (
                  <SelectItem value="no-suppliers" disabled>
                    No suppliers available. Add a supplier first.
                  </SelectItem>
                )}
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issue_date">Invoice Date</Label>
              <Input 
                id="issue_date" 
                type="date" 
                value={issueDate}
                onChange={(e) => onIssueDateChange(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input 
                id="due_date" 
                type="date" 
                value={dueDate}
                onChange={(e) => onDueDateChange(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="invoice_number">Invoice Number</Label>
            <Input 
              id="invoice_number" 
              value={invoiceNumber}
              className="bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={status} 
              onValueChange={onStatusChange}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceSupplierSection;
