import { Button } from '@components/ui/button';
import { CirclePause, CirclePlay, CircleStop } from 'lucide-react';

export default function Page() {
  return (
    <>
      <h1 className='text-3xl font-bold underline'>Hello world!</h1>
      <CirclePlay />
      <CirclePause />
      <CircleStop />
      <Button>Click me</Button>
    </>
  );
}
