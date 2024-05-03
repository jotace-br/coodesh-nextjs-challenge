import { useRadio } from 'contexts/radio-context';
import { LoaderCircle, Pause, Play } from 'lucide-react';

export function PlayerPlayPauseBtn() {
  const { isPlaying, isFetching, currentRadio, playPause } = useRadio();

  const handlePlayPause = () => {
    if (isFetching) {
      return;
    }

    playPause();
  };

  return (
    <button
      onClick={handlePlayPause}
      className={`flex rounded-full bg-gray-50 text-primary/80 transition-transform hover:bg-gray-300 hover:text-primary/80 hover:scale-105 cursor-pointer p-2 $${
        isFetching || currentRadio === null ? 'cursor-not-allowed' : ''
      }`}
      disabled={isFetching || currentRadio === null}
    >
      {isFetching ? (
        <LoaderCircle
          strokeWidth={2.5}
          className='animate-spin text-primary/80'
        />
      ) : isPlaying ? (
        <>
          <Pause fill='text-primary/80' />
          <span className='sr-only'>Pause radio</span>
        </>
      ) : (
        <>
          <Play fill='text-primary/80' />
          <span className='sr-only'>Play radio</span>
        </>
      )}
    </button>
  );
}
