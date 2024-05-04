'use client';
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
  deleteFavorite: (favoriteId: string) => void;
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
  const [volume, setVolume] = useState<number[]>(
    JSON.parse(localStorage.getItem('radio-volume')) || [70]
  );
  const [favorites, setFavorites] = useState<IRadio[]>(
    JSON.parse(localStorage.getItem('favorites')) || []
  );
  const [isFetching, setIsFetching] = useState(false);
  const audioRef = useRef(null);

  // Save volume to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('radio-volume', JSON.stringify(volume));
      } catch (error) {
        console.error('Error saving volume to localStorage:', error);
      }
    }
  }, [volume]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
        toast.error('Failed to save favorites data.');
      }
    }
  }, [favorites]);

  const updateFavorite = (updatedFavorite: IRadio) => {
    setFavorites((prevFavorites) =>
      prevFavorites.map((radio) =>
        radio.stationuuid === updatedFavorite.stationuuid
          ? updatedFavorite
          : radio
      )
    );

    if (currentRadio?.stationuuid === updatedFavorite.stationuuid) {
      setCurrentRadio(updatedFavorite);
      setIsPlaying(true);
    }
  };

  const deleteFavorite = (favoriteId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((radio) => radio.stationuuid !== favoriteId)
    );
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

  const selectRadio = (radio: IRadio) => {
    try {
      if (radio.bitrate === 0) {
        throw new Error('This radio station is currently offline.');
      }

      setCurrentRadio(radio);
      setIsPlaying(true);
    } catch (error) {
      setCurrentRadio(null);
      toast.error('An error occurred while selecting the radio.', {
        description: error.message,
      });
      console.error(error);
    }
  };

  const adjustVolume = (newVolume: number[]) => {
    setVolume(newVolume);
  };

  const addToFavorites = (radio: IRadio) => {
    if (!favorites.find((fav) => fav.stationuuid === radio.stationuuid)) {
      radio.isFavorite = true;

      const updatedFavorites = [...favorites, radio];
      setFavorites(updatedFavorites);
    }
  };

  const removeFromFavorites = (radio: IRadio) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.stationuuid !== radio.stationuuid
    );
    radio.isFavorite = false;
    setFavorites(updatedFavorites);
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
    deleteFavorite,
    handleIsFetching,
  };

  return (
    <RadioContext.Provider value={contextValue}>
      {children}
    </RadioContext.Provider>
  );
};
