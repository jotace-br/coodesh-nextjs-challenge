'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRadio } from 'contexts/radio-context';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IRadio } from 'types/IRadio';
import { z } from 'zod';

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
              <Button variant='ghost' className='relative h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
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
          <DeleteContent
            handleDeleteFavorite={removeFromFavorites}
            station={station}
          />

          {/* Edit station content */}
          <EditContent
            updateFavorite={updateFavorite}
            station={station}
            setIsEditing={setIsEditing}
          />
        </AlertDialog>
      </Dialog>
    </div>
  );
}

function DeleteContent({
  handleDeleteFavorite,
  station,
}: {
  handleDeleteFavorite: (station: IRadio) => void;
  station: IRadio;
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => handleDeleteFavorite(station)}>
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

interface EditContentProps {
  station: IRadio;
  updateFavorite: (updatedStation: IRadio) => void;
  setIsEditing: (isEditing: boolean) => void;
}

function EditContent({
  station,
  updateFavorite,
  setIsEditing,
}: EditContentProps) {
  // TODO: Adicionar form handler + zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: station.name.trim(),
      country: station.country.trim(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      updateFavorite({
        ...station,
        name: values.name,
        country: values.country,
      });
      setIsEditing(false);
    } catch (error) {
      toast.error('Uh oh! Something went wrong.', {
        description: error.message,
      });
    }
  };

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Edit station</DialogTitle>
        <DialogDescription>
          Make changes to your favorite station here. Click save when you're
          done.
        </DialogDescription>
      </DialogHeader>
      <div className='grid gap-2 py-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter station name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter country' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
