'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { IStation } from 'types/IStation';
import { PlayFromTable } from './play-from-table';

import { TableDropdown } from './table-dropdown';

export const columns: ColumnDef<IStation>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Station
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const station = row.original;

      return (
        <div className='flex items-center gap-4'>
          <PlayFromTable rowData={station} />
          <p>{station.name || 'Unnamed station'}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'country',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const station = row.original;

      return (
        <div className='flex flex-wrap items-center justify-start gap-2'>
          {!station.tags
            ? 'No tags available.'
            : station.tags.split(',').map((tag) => (
                <Badge
                  className='capitalize shadow-sm select-none text-center'
                  variant='secondary'
                  key={tag}
                >
                  {tag}
                </Badge>
              ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const favoriteStation = row.original;

      return <TableDropdown station={favoriteStation} />;
    },
  },
];
