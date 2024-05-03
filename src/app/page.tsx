import { FavoritesTable } from '@components/favorites/favorites-table';
import { Player } from '@components/player/player';
import { Radio } from 'lucide-react';

export default function Page() {
  return (
    <div className='flex flex-col w-full h-screen'>
      <section className='p-4 flex-grow overflow-y-auto pb-44 sm:pb-24'>
        <div className='justify-end bg-sidebar rounded px-8 py-4'>
          <div className='flex items-center gap-1'>
            <h1 className='text-2xl font-bold tracking-tighter'>Seeker</h1>
            <Radio />
          </div>

          {/* divider */}
          <hr className='border-t border-slate-100/10 mb-2' />

          <FavoritesTable />
        </div>
      </section>

      <Player />
    </div>
  );
}
