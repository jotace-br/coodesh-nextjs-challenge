import { Button } from '@components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Input } from '@components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { SetStateAction } from 'react';
import { FilterSelectType } from './data-table';

interface HeaderTableProps<TData> {
  filterBy: string;
  setFilterBy: (value: SetStateAction<FilterSelectType>) => void;
  table?: Table<TData>;
}

export function HeaderTable<TData>({
  filterBy,
  setFilterBy,
  table,
}: HeaderTableProps<TData>) {
  return (
    <div className='flex flex-wrap mb-2 md:mb-0 items-center md:justify-between gap-2'>
      <div className='flex flex-wrap md:flex-nowrap items-center py-0 md:py-4 gap-2 w-full md:w-1/2'>
        <Input
          placeholder={`Filter by ${
            filterBy === 'name' ? 'station' : filterBy
          }...`}
          value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            const filterValue = event.target.value;
            table.getColumn(filterBy)?.setFilterValue(filterValue);
          }}
        />

        <Select
          value={filterBy}
          onValueChange={(value) => setFilterBy(value as FilterSelectType)}
        >
          <SelectTrigger className='w-full md:w-[180px]' aria-label='Filter by'>
            <SelectValue placeholder='Filter by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Station</SelectItem>
            <SelectItem value='country'>Country</SelectItem>
            <SelectItem value='tags'>Tags</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-full md:w-auto md:ml-auto'>
            Columns <ChevronDown size={16} className='ml-2' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
