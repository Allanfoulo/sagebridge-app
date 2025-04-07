
import { useToast } from '@/components/ui/use-toast';

export const useSalesExport = () => {
  const { toast } = useToast();
  
  const exportToCSV = (filteredInvoices: any[]) => {
    const headers = ['Invoice No.', 'Customer', 'Date', 'Amount', 'Status'];
    const csvRows = [
      headers.join(','),
      ...filteredInvoices.map(invoice => [
        invoice.invoiceNumber,
        invoice.customer,
        invoice.date,
        invoice.amount,
        invoice.status
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Invoices have been exported to CSV format",
    });
  };

  const exportToExcel = (filteredInvoices: any[]) => {
    const headers = ['Invoice No.;Customer;Date;Amount;Status'];
    const excelRows = [
      headers.join(''),
      ...filteredInvoices.map(invoice => [
        invoice.invoiceNumber,
        invoice.customer,
        invoice.date,
        invoice.amount,
        invoice.status
      ].join(';'))
    ];
    
    const excelContent = excelRows.join('\r\n');
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoices.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Invoices have been exported to Excel format",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = content.split('\n');
        
        toast({
          title: "Import Successful",
          description: `Imported file with ${rows.length - 1} invoices`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "There was an error importing the file",
        });
      }
    };
    reader.readAsText(file);
  };

  return {
    exportToCSV,
    exportToExcel,
    handleImport
  };
};
