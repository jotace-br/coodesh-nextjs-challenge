'use client';
import { AlertDialog, AlertDialogTrigger } from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { Dialog, DialogTrigger } from '@components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useRadio } from 'contexts/radio-context';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { IRadio } from 'types/IRadio';
import { z } from 'zod';
import { DeleteContentAlert } from './delete-content-alert';
import { EditContentDialog } from './edit-content-dialog';

const formSchema = z.object({
  name: z.string().nonempty('Station name is required'),
  country: z.string().nonempty('Country is required'),
});

interface TableDropdownProps {
  station: IRadio;
}

export function TableDropdown({ station }: TableDropdownProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { removeFromFavorites, updateFavorite } = useRadio();

  return (
    <div className='text-right'>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='relative h-8 w-8 p-0 justify-center'
              >
                <span className='sr-only'>Open menu</span>
                <EllipsisVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DialogTrigger asChild>
                <DropdownMenuItem className='cursor-pointer hover:font-medium'>
                  Edit station
                </DropdownMenuItem>
              </DialogTrigger>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem className='cursor-pointer hover:font-medium'>
                  Delete station
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete station content */}
          <DeleteContentAlert
            handleDeleteFavorite={removeFromFavorites}
            station={station}
          />

          {/* Edit station content */}
          <EditContentDialog
            updateFavorite={updateFavorite}
            station={station}
            setIsEditing={setIsEditing}
          />
        </AlertDialog>
      </Dialog>
    </div>
  );
}
