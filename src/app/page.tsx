import { FavoritesTable } from '@components/favorites/favorites-table';
import { Player } from '@components/player/player';
import { TopClicks } from '@components/top-clicks/top-clicks';
import { Radio } from 'lucide-react';

export default function Page() {
  return (
    <div className='flex flex-col w-full h-screen'>
      <section className='p-4 flex-grow pb-44 sm:pb-24'>
        <div className='justify-end bg-sidebar rounded px-8 py-4 w-full'>
          <header className='flex items-center gap-1'>
            <h1 className='text-2xl font-bold tracking-tighter'>Seeker</h1>
            <Radio />
          </header>

          <hr className='border-t border-slate-100/10 mb-2 py-2' />

          <TopClicks />

          <hr className='border-t border-slate-100/10 my-4' />

          <FavoritesTable />
        </div>
      </section>

      <Player />
    </div>
  );
}
