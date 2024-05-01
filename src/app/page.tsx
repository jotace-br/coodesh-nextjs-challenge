import { Player } from '@components/player/player';
import { Button } from '@components/ui/button';

export default function Page() {
  return (
    <div className='relative h-dvh'>
      <section className='p-4'>
        <div className='bg-sidebar rounded px-8 py-4'>
          <h1 className='text-3xl font-bold underline'>Hello world!</h1>
          <Button>Click me</Button>
          <p>listagem</p>
        </div>
      </section>

      <Player />
    </div>
  );
}
