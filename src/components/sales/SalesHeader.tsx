
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, FileSpreadsheet } from 'lucide-react';

interface SalesHeaderProps {
  exportToCSV: () => void;
  exportToExcel: () => void;
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SalesHeader: React.FC<SalesHeaderProps> = ({ 
  exportToCSV, 
  exportToExcel, 
  handleImport 
}) => {
  const navigate = useNavigate();

  const navigateToNewInvoice = () => {
    navigate('/sales/new-invoice');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">Manage your invoices, quotes, and customers</p>
      </div>
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="file"
            id="importFile"
            accept=".csv,.xls,.xlsx"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImport}
          />
          <Button variant="outline" className="flex items-center">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
              <FileText size={16} className="mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
              <FileSpreadsheet size={16} className="mr-2" />
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={navigateToNewInvoice} className="flex items-center">
          <PlusCircle size={16} className="mr-2" />
          New Invoice
        </Button>
      </div>
    </div>
  );
};

export default SalesHeader;
