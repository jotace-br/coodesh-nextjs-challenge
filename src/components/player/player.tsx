'use client';
import { useToast } from '@components/ui/use-toast';
import { useRadio } from 'contexts/radio-context';
import { useEffect, useRef, useState } from 'react';
import { PlayerAddRadioToFavorites } from './player-add-radio-to-favorites';
import { PlayerPlayPauseBtn } from './player-play-pause-btn';
import { PlayerRadioInfo } from './player-radio-info';
import { PlayerVolume } from './player-volume';

export function Player() {
  const { currentRadio, volume, selectRadio } = useRadio();
  const { toast } = useToast();

  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentRadio) {
      audioRef.current.src = currentRadio.url_resolved;

      setIsLoading(true);
      audioRef.current
        .play()
        .catch((error) => {
          toast({
            title: 'Uh oh! Something went wrong.',
            description: error.message,
          });
          selectRadio(null);
        })
        .finally(() => setIsLoading(false));
    }
  }, [currentRadio]);

  const handleAudioLoadedData = () => {
    setIsLoading(false);
  };

  const handleAudioWaiting = () => {
    setIsLoading(true);
  };

  return (
    <div className='absolute content-center bottom-0 w-full sm:h-20 bg-sidebar p-4'>
      <audio
        ref={audioRef}
        src={currentRadio?.url_resolved}
        onLoadedData={handleAudioLoadedData}
        onWaiting={handleAudioWaiting}
        controls
        hidden
      />
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='flex gap-2 items-center justify-center sm:justify-start w-full'>
          <PlayerPlayPauseBtn isLoading={isLoading} audioRef={audioRef} />

          <PlayerRadioInfo isLoading={isLoading} />
        </div>

        <section className='flex gap-3 items-center'>
          <PlayerAddRadioToFavorites />

          <PlayerVolume audioRef={audioRef} />
        </section>
      </div>
    </div>
  );
}
