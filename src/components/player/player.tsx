'use client';
import { useRadio } from 'contexts/radio-context';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { PlayerAddRadioToFavorites } from './player-add-radio-to-favorites';
import { PlayerPlayPauseBtn } from './player-play-pause-btn';
import { PlayerRadioInfo } from './player-radio-info';
import { PlayerVolume } from './player-volume';

const WAITING_TIMEOUT = 3000 * 10; // 30s = 3000 * 10

export function Player() {
  const {
    volume,
    currentRadio,
    selectRadio,
    audioRef,
    handleIsFetching,
    playPause,
    isPlaying,
  } = useRadio();

  const isPlayingRef = useRef(false);
  const audioWaitingTimeout = useRef<NodeJS.Timeout | null>(null);

  const clearAudioTimeout = useCallback(() => {
    if (audioWaitingTimeout.current) {
      clearTimeout(audioWaitingTimeout.current);
      audioWaitingTimeout.current = null;
    }
  }, []);

  const playAudio = useCallback(async () => {
    try {
      await audioRef.current?.play();
      clearAudioTimeout();
      handleIsFetching(false);
      isPlayingRef.current = true;
    } catch (error) {
      isPlayingRef.current = false;
      handleIsFetching(false);

      toast.error('Failed to connect to the radio station.', {
        description: error.message,
        dismissible: false,
        action: {
          label: 'Retry',
          onClick: handleRetry,
        },
      });
    }
  }, [clearAudioTimeout, audioRef, handleIsFetching]);

  const handlePlayPause = useCallback(
    (e: Event) => {
      e.preventDefault();
      isPlayingRef.current = !audioRef.current?.paused;
      handleIsFetching(true);
      playPause();
      handleIsFetching(false);
    },
    [audioRef, handleIsFetching, playPause]
  );

  const handleAudioLoadedData = useCallback(() => {
    clearAudioTimeout();
    handleIsFetching(false);
  }, [clearAudioTimeout, handleIsFetching]);

  const handleAudioWaiting = useCallback(() => {
    const audio = audioRef.current;
    clearAudioTimeout();
    handleIsFetching(true);

    audioWaitingTimeout.current = setTimeout(() => {
      handleIsFetching(false);
      audio?.pause();
      audio.src = '';
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
  }, [audioRef, clearAudioTimeout, handleIsFetching, selectRadio]);

  const handleAudioCanPlay = useCallback(() => {
    clearAudioTimeout();
    handleIsFetching(false);
  }, [clearAudioTimeout, handleIsFetching]);

  const handleRetry = useCallback(async () => {
    clearAudioTimeout();
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
  }, [clearAudioTimeout, currentRadio, handleIsFetching, selectRadio]);

  const handleOnError = useCallback(() => {
    clearAudioTimeout();
    handleIsFetching(false);

    toast.error('Failed to connect to the radio station.', {
      description: 'An error occurred while connecting to the radio station.',
      dismissible: false,
      action: {
        label: 'Retry',
        onClick: handleRetry,
      },
    });
  }, [clearAudioTimeout, handleIsFetching]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio && currentRadio) {
      clearAudioTimeout();
      handleIsFetching(true);

      audio.src = currentRadio.url_resolved || currentRadio.url;
      audio.volume = volume[0] / 100;

      audio.addEventListener('loadeddata', handleAudioLoadedData);
      audio.addEventListener('waiting', handleAudioWaiting);
      audio.addEventListener('canplay', handleAudioCanPlay);
      audio.addEventListener('error', handleOnError);

      playAudio();

      return () => {
        audio.removeEventListener('loadeddata', handleAudioLoadedData);
        audio.removeEventListener('waiting', handleAudioWaiting);
        audio.removeEventListener('canplay', handleAudioCanPlay);
        audio.removeEventListener('error', handleOnError);
        clearAudioTimeout();
      };
    }
  }, [currentRadio]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.addEventListener('pause', handlePlayPause);
    } else {
      audio.addEventListener('play', handlePlayPause);
    }

    return () => {
      audio.removeEventListener('pause', handlePlayPause);
      audio.removeEventListener('play', handlePlayPause);
    };
  }, [isPlaying, currentRadio]);

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
