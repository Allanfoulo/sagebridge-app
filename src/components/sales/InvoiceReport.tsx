import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer, Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getCurrencySymbol } from '@/utils/salesInvoiceService';
import { useCurrency } from '@/contexts/CurrencyContext';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface InvoiceData {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  notes?: string;
}

interface InvoiceReportProps {
  invoiceId: string;
  onClose: () => void;
}

const InvoiceReport: React.FC<InvoiceReportProps> = ({ invoiceId, onClose }) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch invoice with customer details
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('sales_invoices')
        .select(`
          id,
          invoice_number,
          issue_date,
          due_date,
          subtotal,
          tax_amount,
          total_amount,
          status,
          notes,
          customers(name, email, phone, address)
        `)
        .eq('id', invoiceId)
        .single();

      if (invoiceError) throw invoiceError;

      // Fetch invoice items
      const { data: itemsData, error: itemsError } = await supabase
        .from('sales_invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId);

      if (itemsError) throw itemsError;

      setInvoice({
        ...invoiceData,
        customer: invoiceData.customers || { name: 'Unknown Customer' },
        items: itemsData || []
      });

    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load invoice details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    // Hide the action buttons and show a print-friendly version
    const actionButtons = document.querySelector('.print\\:hidden');
    if (actionButtons) {
      (actionButtons as HTMLElement).style.display = 'none';
    }
    
    // Trigger print
    window.print();
    
    // Restore the action buttons after printing
    setTimeout(() => {
      if (actionButtons) {
        (actionButtons as HTMLElement).style.display = 'flex';
      }
    }, 1000);
  };

  const handleDownload = async () => {
    if (!invoice) return;
    
    setIsDownloading(true);
    try {
      // Create a new window with the invoice content for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window. Please check your popup blocker.');
      }

      // Generate HTML content for the invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; }
            .invoice-title { color: #2563eb; font-size: 28px; font-weight: bold; margin-bottom: 8px; }
            .invoice-number { font-size: 18px; font-weight: 600; }
            .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
            .status-draft { background-color: #dbeafe; color: #1e40af; }
            .status-paid { background-color: #dcfce7; color: #166534; }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-overdue { background-color: #fee2e2; color: #991b1b; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .bill-to h3 { font-weight: 600; margin-bottom: 8px; }
            .bill-to p { margin: 2px 0; font-size: 14px; }
            .invoice-details { text-align: right; }
            .invoice-details div { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 14px; }
            .invoice-details .label { color: #6b7280; margin-right: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { font-weight: 600; background-color: #f9fafb; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals { width: 300px; margin-left: auto; margin-top: 20px; }
            .totals div { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .total-line { font-weight: bold; font-size: 18px; border-top: 1px solid #e5e7eb; padding-top: 8px; }
            .notes { margin-top: 30px; }
            .notes h3 { font-weight: 600; margin-bottom: 8px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">${invoice.invoice_number}</div>
            </div>
            <div>
              <span class="status-badge status-${invoice.status.toLowerCase()}">
                Status: ${invoice.status}
              </span>
            </div>
          </div>

          <div class="details-grid">
            <div class="bill-to">
              <h3>Bill To:</h3>
              <p><strong>${invoice.customer.name}</strong></p>
              ${invoice.customer.email ? `<p>${invoice.customer.email}</p>` : ''}
              ${invoice.customer.phone ? `<p>${invoice.customer.phone}</p>` : ''}
              ${invoice.customer.address ? `<p>${invoice.customer.address}</p>` : ''}
            </div>
            
            <div class="invoice-details">
              <div>
                <span class="label">Invoice Date:</span>
                <span>${new Date(invoice.invoice_date).toLocaleDateString()}</span>
              </div>
              <div>
                <span class="label">Due Date:</span>
                <span>${new Date(invoice.due_date).toLocaleDateString()}</span>
              </div>
              ${invoice.payment_terms ? `
                <div>
                  <span class="label">Payment Terms:</span>
                  <span>${invoice.payment_terms}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Unit Price</th>

                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">${formatCurrency(item.unit_price)}</td>
                  <td class="text-right">${formatCurrency(item.total_price)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div>
              <span>Subtotal:</span>
              <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            <div>
              <span>Tax:</span>
              <span>${formatCurrency(invoice.tax_amount)}</span>
            </div>
            <div class="total-line">
              <span>Total:</span>
              <span>${formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>

          ${invoice.notes ? `
            <div class="notes">
              <h3>Notes</h3>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();

      // Wait a moment for the content to load, then print
      setTimeout(() => {
        printWindow.print();
        
        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
        
        // Fallback to close window after a delay
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
          }
        }, 3000);
      }, 500);

      toast({
        title: "Download Started",
        description: "Your invoice PDF download should start shortly. If it doesn't, please check your browser's print dialog.",
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again or use the print function.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
          <CardContent className="p-8">
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
          <CardContent className="p-8">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Invoice not found.</p>
              <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="print:hidden">
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Report</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                disabled={isDownloading}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Generating...' : 'Download'}
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">INVOICE</h1>
                <p className="text-lg font-semibold">{invoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground">Status: </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    invoice.status === 'Draft' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <div className="text-sm">
                  <p className="font-medium">{invoice.customer.name}</p>
                  {invoice.customer.email && <p>{invoice.customer.email}</p>}
                  {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
                  {invoice.customer.address && <p>{invoice.customer.address}</p>}
                </div>
              </div>
              
              <div className="text-right">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Date:</span>
                    <span>{new Date(invoice.issue_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Invoice Items */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Description</th>
                    <th className="text-center py-2 font-medium">Qty</th>
                    <th className="text-right py-2 font-medium">Unit Price</th>

                    <th className="text-right py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>{formatCurrency(invoice.tax_amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
            <p>Thank you for your business!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceReport;
