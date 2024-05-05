import { PlayerCard } from '@components/player/player-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';
import { fetchMostClickedRadios } from 'api/fetchMostClickedRadios';
import { Nfc } from 'lucide-react';
import { IRadio } from 'types/IRadio';

export async function TopClicks() {
  const data: IRadio[] = await fetchMostClickedRadios();

  return (
    <div>
      <section className='flex items-center gap-2 mb-2'>
        <h2 className='text-xl font-bold text-slate-50'>
          Top clicked radio stations
        </h2>
        <Nfc size={16} />
      </section>

      <Carousel
        opts={{
          align: 'center',
        }}
        className='md:mx-12'
      >
        <CarouselContent className='w-0 md:w-96'>
          {data.map((station) => (
            <CarouselItem key={station.stationuuid} className='basis-auto'>
              <PlayerCard
                station={station}
                className='w-52 h-fit aspect-square'
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className='hidden md:block'>
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>

      <br />
    </div>
  );
}
