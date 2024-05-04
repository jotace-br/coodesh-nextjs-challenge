'use client';
import { useRadio } from 'contexts/radio-context';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PlayerAddRadioToFavorites } from './player-add-radio-to-favorites';
import { PlayerPlayPauseBtn } from './player-play-pause-btn';
import { PlayerRadioInfo } from './player-radio-info';
import { PlayerVolume } from './player-volume';

export function Player() {
  const {
    currentRadio,
    volume,
    selectRadio,
    audioRef,
    handleIsFetching,
    playPause,
  } = useRadio();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentRadio) {
      handleIsFetching(true);

      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }

      audioRef.current.src = currentRadio.url_resolved || currentRadio.url;

      audioRef.current.play().finally(() => {
        handleIsFetching(false);
      });
    }
  }, [currentRadio]);

  const handleAudioLoadedData = () => {
    handleIsFetching(false);
  };

  const handleAudioWaiting = () => {
    handleIsFetching(true);
  };

  const handleAudioError = () => {
    toast.error('Failed to load radio stream.', {
      description:
        'The radio stream could not be loaded. Please try again later.',
    });
    handleIsFetching(false);
    selectRadio(null);
    playPause();
  };

  return (
    <div className='fill-available w-full h-40 fixed bottom-0 content-center sm:h-20 bg-sidebar p-4'>
      <audio
        ref={audioRef}
        src={currentRadio?.url || currentRadio?.url_resolved}
        onLoadedData={handleAudioLoadedData}
        onWaiting={handleAudioWaiting}
        onError={handleAudioError}
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
