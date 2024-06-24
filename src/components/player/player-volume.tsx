import { Slider } from '@components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { useRadio } from 'contexts/radio-context';
import { useDebounce } from 'hooks/use-debounce';
import { Volume1, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PlayerVolume() {
  const { volume, adjustVolume, audioRef } = useRadio();
  const [lastVolume, setLastVolume] = useState(volume[0] || 100);
  const debouncedVolume = useDebounce(volume[0], 300);

  useEffect(() => {
    if (debouncedVolume > 0) {
      setLastVolume(debouncedVolume);
    }
  }, [debouncedVolume]);

  const handleMute = () => {
    const newVolume = volume[0] === 0 ? lastVolume : 0;
    handleVolumeChange([newVolume]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    adjustVolume(value);

    if (audio) {
      audio.volume = value[0] / 100;
    }
  };

  const handleVolumeCommit = (value: number[]) => {
    setLastVolume(value[0]);
  };

  return (
    <div className='flex gap-2'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={handleMute}>
              <span className='sr-only'>
                {volume[0] === 0 ? 'Unmute' : 'Mute'}
              </span>
              {volume[0] === 0 ? (
                <VolumeX />
              ) : volume[0] < 50 ? (
                <Volume1 />
              ) : (
                <Volume2 />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{volume[0] === 0 ? 'Unmute' : 'Mute'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Slider
        className='w-32'
        max={100}
        step={1}
        defaultValue={[70]}
        value={volume}
        onValueChange={handleVolumeChange}
        onValueCommit={handleVolumeCommit}
      />
    </div>
  );
}
