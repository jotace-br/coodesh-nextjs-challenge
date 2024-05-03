'use client';
import { useRadio } from 'contexts/radio-context';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PlayerAddRadioToFavorites } from './player-add-radio-to-favorites';
import { PlayerPlayPauseBtn } from './player-play-pause-btn';
import { PlayerRadioInfo } from './player-radio-info';
import { PlayerVolume } from './player-volume';

export function Player() {
  const { currentRadio, volume, selectRadio, audioRef, handleIsFetching } =
    useRadio();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentRadio) {
      audioRef.current.src = currentRadio.url_resolved;

      try {
        handleIsFetching(true);
        if (audioRef.current.paused) {
          audioRef.current.play();
        }
      } catch (error) {
        toast.error('Uh oh! Something went wrong.', {
          description: error.message,
        });
        console.error(error.message);
        selectRadio(null);
      } finally {
        handleIsFetching(false);
      }
    }
  }, [currentRadio]);

  const handleAudioLoadedData = () => {
    handleIsFetching(false);
  };

  const handleAudioWaiting = () => {
    handleIsFetching(true);
  };

  return (
    <div className='fill-available w-full h-40 fixed bottom-0 content-center sm:h-20 bg-sidebar p-4'>
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
          <PlayerPlayPauseBtn />

          <PlayerRadioInfo />
        </div>

        <section className='flex gap-3 items-center'>
          <PlayerAddRadioToFavorites />

          <PlayerVolume />
        </section>
      </div>
    </div>
  );
}
