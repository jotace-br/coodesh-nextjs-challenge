'use client';
import { useRadio } from 'contexts/radio-context';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PlayerAddRadioToFavorites } from './player-add-radio-to-favorites';
import { PlayerPlayPauseBtn } from './player-play-pause-btn';
import { PlayerRadioInfo } from './player-radio-info';
import { PlayerVolume } from './player-volume';

const WAITING_TIMEOUT = 3000 * 10; // 30s = 3000 * 10

export function Player() {
  let audioWaitingTimeout: NodeJS.Timeout;

  const { volume, currentRadio, selectRadio, audioRef, handleIsFetching } =
    useRadio();

  useEffect(() => {
    if (audioRef.current && currentRadio) {
      handleIsFetching(true);
      clearTimeout(audioWaitingTimeout);

      audioRef.current.src = currentRadio.url_resolved || currentRadio.url;
      audioRef.current.volume = volume[0] / 100;

      audioRef.current.addEventListener('loadeddata', handleAudioLoadedData);
      audioRef.current.addEventListener('waiting', handleAudioWaiting);
      audioRef.current.addEventListener('canplay', handleAudioCanPlay);

      audioRef.current
        .play()
        .then(() => {
          handleIsFetching(false);
          clearTimeout(audioWaitingTimeout);
        })
        .finally(() => {
          handleIsFetching(false);
        });

      return () => {
        audioRef.current.removeEventListener(
          'loadeddata',
          handleAudioLoadedData
        );
        audioRef.current.removeEventListener('waiting', handleAudioWaiting);
        audioRef.current.removeEventListener('canplay', handleAudioCanPlay);
      };
    }
  }, [currentRadio]);

  const handleAudioLoadedData = () => {
    clearTimeout(audioWaitingTimeout);
    handleIsFetching(false);
  };

  const handleAudioWaiting = () => {
    handleIsFetching(true);

    audioWaitingTimeout = setTimeout(() => {
      handleIsFetching(false);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      selectRadio(null);

      toast.error('Long duration elapsed without audio.', {
        description: 'Failed to connect to the radio station. Please retry.',
        dismissible: false,
        action: {
          label: 'Retry',
          onClick: handleRetry,
        },
      });
    }, WAITING_TIMEOUT);
  };

  const handleAudioCanPlay = () => {
    clearTimeout(audioWaitingTimeout);
    handleIsFetching(false);
  };

  const handleRetry = async () => {
    clearTimeout(audioWaitingTimeout);

    toast.promise(
      (async () => {
        try {
          handleIsFetching(true);
          await selectRadio(currentRadio);
          handleIsFetching(false);
          toast.dismiss();
        } catch (error) {
          handleIsFetching(false);
          toast.error(`Failed to connect to ${currentRadio.name}.`, {
            description: error.message,
          });
          selectRadio(null);
        }
      })(),
      {
        loading: `Retrying to connect to ${currentRadio.name}...`,
        success: `Connected to ${currentRadio.name}.`,
        error: `Failed to connect to ${currentRadio.name}.`,
      }
    );
  };

  return (
    <div className='fill-available w-full h-40 fixed bottom-0 content-center sm:h-20 bg-sidebar p-4'>
      <audio ref={audioRef} controls hidden />
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
