
import React, { useState } from 'react';
import { Loader2, Check, Clock, X } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateInvoiceStatus } from '@/utils/salesInvoiceService';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  isLoading: boolean;
  searchQuery: string;
  onStatusUpdate?: () => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  filteredInvoices, 
  isLoading, 
  searchQuery,
  onStatusUpdate 
}) => {
  const { toast } = useToast();
  const [updatingInvoice, setUpdatingInvoice] = useState<string | null>(null);

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    setUpdatingInvoice(invoiceId);
    try {
      const result = await updateInvoiceStatus(invoiceId, newStatus);
      if (result.success) {
        toast({
          title: "Status updated",
          description: `Invoice status changed to ${newStatus}`,
        });
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error || "Failed to update invoice status",
        });
      }
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setUpdatingInvoice(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'Pending':
        return <X className="h-4 w-4 text-yellow-600" />;
      case 'Overdue':
        return <Clock className="h-4 w-4 text-red-600" />;
      case 'Draft':
        return <span className="h-4 w-4 rounded-full bg-blue-200"></span>;
      default:
        return null;
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full mt-4">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Invoice No.</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-lightGray/70">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-sage-lightGray/50 transition-colors">
                    <td className="py-3 text-sm font-medium">{invoice.invoiceNumber}</td>
                    <td className="py-3 text-sm">{invoice.customer}</td>
                    <td className="py-3 text-sm">{invoice.date}</td>
                    <td className="py-3 text-sm font-medium">{invoice.amount}</td>
                    <td className="py-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        invoice.status === 'Draft' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <span className="mr-1">{getStatusIcon(invoice.status)}</span>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex gap-2">
                        <button className="text-primary-500 hover:text-primary-600">View</button>
                        <button className="text-primary-500 hover:text-primary-600">Edit</button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 px-2 text-primary-500 hover:text-primary-600">
                              {updatingInvoice === invoice.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Status"
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(invoice.id, 'Paid')}
                              disabled={invoice.status === 'Paid' || updatingInvoice === invoice.id}
                              className="flex items-center gap-2"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                              <span>Mark as Paid</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(invoice.id, 'Pending')}
                              disabled={invoice.status === 'Pending' || updatingInvoice === invoice.id}
                              className="flex items-center gap-2"
                            >
                              <X className="h-4 w-4 text-yellow-600" />
                              <span>Mark as Unpaid</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(invoice.id, 'Overdue')}
                              disabled={invoice.status === 'Overdue' || updatingInvoice === invoice.id}
                              className="flex items-center gap-2"
                            >
                              <Clock className="h-4 w-4 text-red-600" />
                              <span>Mark as Overdue</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(invoice.id, 'Draft')}
                              disabled={invoice.status === 'Draft' || updatingInvoice === invoice.id}
                              className="flex items-center gap-2"
                            >
                              <span className="h-4 w-4 rounded-full bg-blue-200"></span>
                              <span>Mark as Draft</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    {searchQuery ? 'No invoices found matching your search' : 'No invoices found. Create your first invoice!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
        {filteredInvoices.length > 0 && (
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-lightGray transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary-500 text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-lightGray transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default InvoiceTable;
