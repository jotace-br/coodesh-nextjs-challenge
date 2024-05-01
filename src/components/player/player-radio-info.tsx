import { Skeleton } from '@components/ui/skeleton';
import { useRadio } from 'contexts/radio-context';
import { Radio } from 'lucide-react';
import Image from 'next/image';

interface PlayerRadioInfoProps {
  isLoading: boolean;
}

export function PlayerRadioInfo({ isLoading }: PlayerRadioInfoProps) {
  const { isPlaying, currentRadio } = useRadio();

  return (
    <>
      <div className='ml-1'>
        {currentRadio?.favicon ? (
          <div className='rounded-md bg-primary/20'>
            <Image
              src={currentRadio?.favicon}
              alt={currentRadio?.name}
              width={50}
              height={50}
              className='aspect-square object-contain p-0.5'
            />
          </div>
        ) : (
          <Radio />
        )}
      </div>

      <section className='flex items-start gap-2'>
        <div className='flex-col'>
          {isLoading ? (
            <Skeleton className='w-36 h-4 mb-2 bg-stone-600/20' />
          ) : (
            <p className={'first-letter:uppercase text-normal font-semibold'}>
              {isPlaying ? 'Current playing' : 'Paused'}:{' '}
              {currentRadio?.name || 'No radio selected'}
            </p>
          )}

          {isLoading ? (
            <Skeleton className='w-24 h-4 bg-stone-600/20' />
          ) : (
            currentRadio?.country && (
              <p className='first-letter:uppercase text-xs text-stone-300'>
                {currentRadio?.country || 'Unknown country'}
              </p>
            )
          )}
        </div>
      </section>
    </>
  );
}
