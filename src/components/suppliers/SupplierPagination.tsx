
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

interface SupplierPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  filteredCount: number;
  itemName: string;
}

const SupplierPagination: React.FC<SupplierPaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  filteredCount,
  itemName
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing <strong>{Math.min(1 + (currentPage - 1) * itemsPerPage, filteredCount)}</strong> to{' '}
        <strong>{Math.min(currentPage * itemsPerPage, filteredCount)}</strong> of{' '}
        <strong>{filteredCount}</strong> {itemName}
      </div>
      <Pagination>
        <PaginationContent>
          {currentPage > 1 ? (
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              />
            </PaginationItem>
          ) : (
            <PaginationItem>
              <PaginationPrevious
                className="pointer-events-none opacity-50"
                onClick={() => {}}
              />
            </PaginationItem>
          )}
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {currentPage < totalPages ? (
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              />
            </PaginationItem>
          ) : (
            <PaginationItem>
              <PaginationNext
                className="pointer-events-none opacity-50"
                onClick={() => {}}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default SupplierPagination;
