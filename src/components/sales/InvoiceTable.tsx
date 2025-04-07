
import React from 'react';
import { Loader2 } from 'lucide-react';

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
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  filteredInvoices, 
  isLoading, 
  searchQuery 
}) => {
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
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex gap-2">
                        <button className="text-primary-500 hover:text-primary-600">View</button>
                        <button className="text-primary-500 hover:text-primary-600">Edit</button>
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
