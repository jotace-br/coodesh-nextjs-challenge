import { Input } from '@components/ui/input';

import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Info } from 'lucide-react';
import { SetStateAction } from 'react';
import { FilterSelectType } from './data-table';

interface ResponsiveHeaderTableProps {
  filterBy: string;
  setFilterBy: (value: SetStateAction<FilterSelectType>) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export function ResponsiveHeaderTable({
  filterBy,
  setFilterBy,
  filterValue,
  setFilterValue,
}: ResponsiveHeaderTableProps) {
  return (
    <>
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
            <SelectTrigger
              className='w-full md:w-[180px]'
              aria-label='Filter by'
            >
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

      <Alert className='my-2'>
        <Info className='h-4 w-4' />
        <AlertTitle>Attention!</AlertTitle>
        <AlertDescription>
          To search for non-favorite radio stations, please use the sidebar.
        </AlertDescription>
      </Alert>
    </>
  );
}
