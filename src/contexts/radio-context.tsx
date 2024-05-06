'use client';

import { stationClickCount } from 'api/stationClickCount';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { IRadio } from 'types/IRadio';

interface RadioContextProps {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  currentRadio: IRadio | null;
  isPlaying: boolean;
  isFetching: boolean;
  volume: number[];
  favorites: IRadio[];
  playPause: () => void;
  selectRadio: (radio: IRadio) => void;
  adjustVolume: (newVolume: number[]) => void;
  addToFavorites: (radio: IRadio) => void;
  removeFromFavorites: (radio: IRadio) => void;
  isFavorite: (radio: IRadio) => boolean;
  updateFavorite: (updatedFavorite: IRadio) => void;
  handleIsFetching: (fetching: boolean) => void;
}

const RadioContext = createContext<RadioContextProps | undefined>(undefined);

export const useRadio = (): RadioContextProps => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentRadio, setCurrentRadio] = useState<IRadio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number[]>([70]);

  const [favorites, setFavorites] = useState<IRadio[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedVolume = window.localStorage.getItem('radio-volume');
      if (storedVolume) {
        setVolume(JSON.parse(storedVolume));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedFavorites = window.localStorage.getItem('favorites');
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    }
  }, []);

  const saveFavoritesToLocalStorage = (updatedFavorites: IRadio[]) => {
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const updateFavorite = (updatedFavorite: IRadio) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.map((radio) =>
        radio.stationuuid === updatedFavorite.stationuuid
          ? updatedFavorite
          : radio
      );

      saveFavoritesToLocalStorage(updatedFavorites);
      return updatedFavorites;
    });

    if (currentRadio?.stationuuid === updatedFavorite.stationuuid) {
      setCurrentRadio(updatedFavorite);
      setIsPlaying(true);
    }
  };

  const handleIsFetching = (fetching: boolean) => {
    setIsFetching(fetching);
  };

  const playPause = () => {
    setIsPlaying(!isPlaying);

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        return;
      }
      audioRef.current.play();
    }
  };

  const selectRadio = async (radio: IRadio) => {
    try {
      if (radio === currentRadio) {
        playPause();
        return;
      }

      if (radio === null) {
        setCurrentRadio(null);
        setIsPlaying(false);
        return;
      }

      if (radio?.bitrate === 0) {
        throw new Error('This radio station is currently offline.');
      }

      const res = await stationClickCount({ stationuuid: radio.stationuuid });

      if (!res.ok) {
        console.info('Failed to update the radio station click count.');
      }

      setCurrentRadio(radio);
      setIsPlaying(true);
    } catch (error) {
      toast.error('An error occurred while selecting the radio.', {
        description: error.message,
      });
      setIsFetching(false);
    }
  };

  const adjustVolume = (newVolume: number[]) => {
    setVolume(newVolume);
    localStorage.setItem('radio-volume', JSON.stringify(newVolume));
  };

  const addToFavorites = (radio: IRadio) => {
    if (!favorites.find((fav) => fav.stationuuid === radio.stationuuid)) {
      radio.isFavorite = true;

      const updatedFavorites = [...favorites, radio];
      setFavorites(updatedFavorites);
      saveFavoritesToLocalStorage(updatedFavorites);
    }
  };

  const removeFromFavorites = (radio: IRadio) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.stationuuid !== radio.stationuuid
    );
    radio.isFavorite = false;
    setFavorites(updatedFavorites);
    saveFavoritesToLocalStorage(updatedFavorites);
  };

  const isFavorite = (radio: IRadio): boolean => {
    return favorites.some(
      (favRadio) => favRadio?.stationuuid === radio?.stationuuid
    );
  };

  const contextValue: RadioContextProps = {
    audioRef,
    currentRadio,
    isPlaying,
    isFetching,
    volume,
    favorites,
    playPause,
    selectRadio,
    adjustVolume,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    updateFavorite,
    handleIsFetching,
  };

  return (
    <RadioContext.Provider value={contextValue}>
      {children}
    </RadioContext.Provider>
  );
};
