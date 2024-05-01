import { useRadio } from 'contexts/radio-context';
import { LoaderCircle, Pause, Play } from 'lucide-react';

interface PlayerPlayPauseBtnProps {
  isLoading: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export function PlayerPlayPauseBtn({
  isLoading,
  audioRef,
}: PlayerPlayPauseBtnProps) {
  const { isPlaying, currentRadio, playPause } = useRadio();

  const handlePlayPause = () => {
    if (isLoading) {
      return;
    }

    playPause();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        return;
      }
      audioRef.current.play();
    }
  };

  return (
    <button
      onClick={handlePlayPause}
      className={`flex rounded-full bg-gray-50 text-primary/80 transition-transform hover:bg-gray-300 hover:text-primary/80 hover:scale-105 cursor-pointer p-2 $${
        isLoading || currentRadio === null ? 'cursor-not-allowed' : ''
      }`}
      disabled={isLoading || currentRadio === null}
    >
      {isLoading ? (
        <LoaderCircle
          strokeWidth={2.5}
          className='animate-spin text-primary/80'
        />
      ) : isPlaying ? (
        <Pause fill='text-primary/80' />
      ) : (
        <Play fill='text-primary/80' />
      )}
    </button>
  );
}
