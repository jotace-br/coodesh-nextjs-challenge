'use client';

import { useRadio } from 'contexts/radio-context';
import { columns } from './columns';
import { DataTable } from './data-table';
import { ResponsiveTable } from './responsive-table';

export function FavoritesTable() {
  const { favorites } = useRadio();

  return (
    <div className='py-2 w-full h-full overflow-y-auto'>
      <h2 className='text-2xl font-bold text-slate-50'>Favorite radios:</h2>

      <div className='hidden md:block'>
        <DataTable columns={columns} data={favorites} />
      </div>

      <div className='md:hidden'>
        <ResponsiveTable />
      </div>
    </div>
  );
}
