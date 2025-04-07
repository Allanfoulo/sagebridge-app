
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { ListFilter } from 'lucide-react';

interface InvoiceListHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const InvoiceListHeader: React.FC<InvoiceListHeaderProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-base">Invoices</CardTitle>
      <div className="flex gap-2">
        <div className="relative">
          <input 
            type="search"
            placeholder="Search invoices..."
            className="w-48 py-1.5 pl-8 pr-3 text-sm rounded-md border border-sage-lightGray focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-4 h-4 text-gray-400"
            >
              <path 
                fillRule="evenodd" 
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        <button className="flex items-center gap-1 p-1.5 rounded-md hover:bg-sage-lightGray transition-colors">
          <ListFilter size={16} /> <span className="text-sm">Filter</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceListHeader;
