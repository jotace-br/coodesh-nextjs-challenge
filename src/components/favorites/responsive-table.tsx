'use client';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { useRadio } from 'contexts/radio-context';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IRadio } from 'types/IRadio';
import { FilterSelectType } from './data-table';
import { PlayFromTable } from './play-from-table';
import { TableDropdown } from './table-dropdown';

export function ResponsiveTable() {
  const { favorites } = useRadio();

  const [filterBy, setFilterBy] = useState<FilterSelectType | null>('name');
  const [filterValue, setFilterValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<IRadio[]>(favorites);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const filterData = () => {
    setFilteredData(
      favorites.filter((station) =>
        station[filterBy].toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  };

  useEffect(() => {
    filterData();
  }, [favorites, filterBy, filterValue]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <section>
      <div className='flex flex-wrap md:mb-0 items-center md:justify-between gap-2'>
        <div className='flex flex-wrap md:flex-nowrap items-center py-0 md:py-4 gap-2 w-full md:w-1/2'>
          <Input
            placeholder={`Filter by ${
              filterBy === 'name' ? 'station' : filterBy
            }...`}
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
          />

          <Select
            value={filterBy}
            onValueChange={(value) => setFilterBy(value as FilterSelectType)}
          >
            <SelectTrigger className='w-full md:w-[180px]'>
              <SelectValue placeholder='Filter by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='name'>Station</SelectItem>
              <SelectItem value='country'>Country</SelectItem>
              <SelectItem value='tags'>Tags</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {currentData.length ? (
          currentData.map((favorite) => (
            <div
              key={favorite.stationuuid}
              className='relative min-h-24 flex items-center space-x-3 rounded-lg bg-card p-4 shadow ring-1 ring-black ring-opacity-5'
            >
              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between space-x-3'>
                  <section className='flex gap-2'>
                    <PlayFromTable rowData={favorite} />

                    <div className='flex-grow-0'>
                      <div className='space-y-0'>
                        <p className='w-full line-clamp-1 text-sm text-balance font-medium text-stone-50'>
                          {favorite.name || 'Unnamed station'}
                        </p>
                        <p className='line-clamp-1 text-sm text-balance text-stone-400'>
                          {favorite.country}
                        </p>
                      </div>

                      {!!favorite.tags.length && (
                        <span className='flex flex-wrap justify-start items-center gap-2 mt-2'>
                          {favorite.tags.split(',').map((tag) => (
                            <Badge
                              key={tag}
                              variant='secondary'
                              className='capitalize text-nowrap'
                            >
                              {tag}
                            </Badge>
                          ))}
                        </span>
                      )}
                    </div>
                  </section>

                  <section className='flex-grow-1'>
                    <TableDropdown station={favorite} />
                  </section>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='h-24 flex items-center justify-center space-x-3 rounded-lg bg-card p-4 shadow ring-1 ring-black ring-opacity-5 text-center text-stone-50'>
            No results.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className='mt-4 flex flex-wrap gap-2 justify-center items-center sm:justify-between'>
        <div className='flex items-center justify-center text-sm font-medium'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Rows per page</p>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className='w-24'>
                <SelectValue placeholder='Rows per page' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='50'>50</SelectItem>
                <SelectItem value='100'>100</SelectItem>
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
            onClick={goToNextPage}
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
    </section>
  );
}
