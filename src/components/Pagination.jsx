import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-center mt-4 space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <ChevronLeft className="w-4 h-4" />
    </Button>
    <span className="text-sm">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <ChevronRight className="w-4 h-4" />
    </Button>
  </div>
);

export default Pagination;