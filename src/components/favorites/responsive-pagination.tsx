import { Button } from '@components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface ResponsivePaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  handleRowsPerPageChange: (value: string) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export function ResponsivePagination({
  currentPage,
  totalPages,
  rowsPerPage,
  handleRowsPerPageChange,
  goToNextPage,
  goToPreviousPage,
}: ResponsivePaginationProps) {
  return (
    <div className='mt-4 flex flex-wrap gap-2 justify-center items-center sm:justify-between'>
      <div className='flex items-center justify-center text-sm font-medium'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className='w-24' aria-label='Rows per page'>
              <SelectValue placeholder='Rows per page' />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  <span className='sr-only'>Rows per page:</span>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex items-center gap-2 md:gap-0 md:space-x-2'>
        <span className='mr-2 text-sm font-medium'>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant='outline'
          className='relative h-8 w-8 p-0'
          onClick={goToPreviousPage}
          disabled={currentPage === totalPages}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='relative h-8 w-8 p-0'
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
