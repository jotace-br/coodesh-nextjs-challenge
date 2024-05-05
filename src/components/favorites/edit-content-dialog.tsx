import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
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
import { Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IRadio } from 'types/IRadio';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().nonempty('Station name is required'),
  country: z.string().nonempty('Country is required'),
});

interface EditContentDialogProps {
  station: IRadio;
  updateFavorite: (updatedStation: IRadio) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export function EditContentDialog({
  station,
  updateFavorite,
  setIsEditing,
}: EditContentDialogProps) {
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

            <Alert className='mb-4'>
              <Info className='h-4 w-4' />
              <AlertTitle>Attention!</AlertTitle>
              <AlertDescription>
                If the radio station is currently playing and you edit it,
                network buffering will occur again. This may result in a brief
                delay.
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
