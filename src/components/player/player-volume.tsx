import { Slider } from '@components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { useRadio } from 'contexts/radio-context';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

export function PlayerVolume() {
  const { volume, adjustVolume, audioRef } = useRadio();

  const handleMute = () => {
    const newVolume = volume[0] === 0 ? 100 : 0;
    handleVolumeChange([newVolume]);
  };

  const handleVolumeChange = (value: number[]) => {
    adjustVolume(value);

    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  return (
    <div className='flex gap-2'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={handleMute}>
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
      />
    </div>
  );
}
