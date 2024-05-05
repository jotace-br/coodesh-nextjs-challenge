import { Skeleton } from '@components/ui/skeleton';
import { useRadio } from 'contexts/radio-context';
import { Radio } from 'lucide-react';
import Image from 'next/image';

export function PlayerRadioInfo() {
  const { isPlaying, isFetching, currentRadio } = useRadio();

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
              className='aspect-square object-contain p-0.5 rounded-md'
            />
          </div>
        ) : (
          <Radio />
        )}
      </div>

      <section className='flex items-start gap-2'>
        <div className='flex-col'>
          {isFetching ? (
            <Skeleton className='w-36 h-4 mb-2 bg-stone-600/20' />
          ) : (
            <p className={'first-letter:uppercase text-normal font-semibold'}>
              {isPlaying ? 'Current playing' : 'Paused'}:{' '}
              {currentRadio?.name || 'No radio selected'}
            </p>
          )}

          {isFetching ? (
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
