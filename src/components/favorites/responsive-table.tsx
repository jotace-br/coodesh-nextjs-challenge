'use client';
import { useRadio } from 'contexts/radio-context';
import { useEffect, useState } from 'react';
import { IRadio } from 'types/IRadio';
import { FilterSelectType } from './data-table';
import { PlayFromTable } from './play-from-table';
import { ResponsiveHeaderTable } from './responsive-header-table';
import { ResponsivePagination } from './responsive-pagination';
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
      <ResponsiveHeaderTable
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />

      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {currentData.length ? (
          currentData.map((favorite) => (
            <div
              key={favorite.stationuuid}
              className='relative min-h-24 flex items-center space-x-3 rounded-lg bg-card p-4 shadow ring-1 ring-black ring-opacity-5'
            >
              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between'>
                  <section className='flex gap-2 max-w-2/3'>
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
                    </div>
                  </section>

                  <section className='max-w-8'>
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

      <ResponsivePagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        handleRowsPerPageChange={handleRowsPerPageChange}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
      />
    </section>
  );
}
