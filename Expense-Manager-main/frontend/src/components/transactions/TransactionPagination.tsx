import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-4 mt-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-800/40 shadow-xl">
      <div className="text-gray-400 text-sm">
        Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-white font-medium">{totalItems}</span> transactions
      </div>
      
      <div className="flex items-center">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg mr-1 transition-all ${
            currentPage === 1
              ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              : 'bg-[#0f172a] text-gray-300 hover:bg-indigo-600/20 hover:text-indigo-400 border border-gray-700/50'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex gap-1">
          {pageNumbers.map((pageNumber, index) => (
            pageNumber === '...' ? (
              <span 
                key={`ellipsis-${index}`} 
                className="px-2 flex items-center text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${pageNumber}`}
                onClick={() => onPageChange(Number(pageNumber))}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
                  currentPage === pageNumber
                    ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/20'
                    : 'bg-[#0f172a] text-gray-300 hover:bg-indigo-600/20 hover:text-indigo-400 border border-gray-700/50'
                }`}
                aria-label={`Page ${pageNumber}`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ml-1 transition-all ${
            currentPage === totalPages
              ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              : 'bg-[#0f172a] text-gray-300 hover:bg-indigo-600/20 hover:text-indigo-400 border border-gray-700/50'
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TransactionPagination; 