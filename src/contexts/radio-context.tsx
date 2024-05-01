'use client';
import { useToast } from '@components/ui/use-toast';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { IStation } from 'types/IStation';

interface Radio extends IStation {
  isFavorite?: boolean;
}

interface RadioContextProps {
  radios: Radio[];
  currentRadio: Radio | null;
  isPlaying: boolean;
  volume: number[];
  favorites: Radio[];
  playPause: () => void;
  selectRadio: (radio: Radio) => void;
  adjustVolume: (newVolume: number[]) => void;
  addToFavorites: (radio: Radio) => void;
  removeFromFavorites: (radio: Radio) => void;
  isFavorite: (radio: Radio) => boolean;
  createRadio: (radio: Radio) => void;
  readRadios: () => void;
  updateRadio: (updatedRadio: Radio) => void;
  deleteRadio: (radioId: string) => void;
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
  const [radios, setRadios] = useState<Radio[]>([]);
  const [currentRadio, setCurrentRadio] = useState<Radio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number[]>([70]);
  const [favorites, setFavorites] = useState<Radio[]>([]);
  const { toast } = useToast();

  // CRUD operations
  const createRadio = (radio: Radio) => {
    setRadios([...radios, radio]);
  };

  const readRadios = () => {
    // You can fetch radios from an API or other data source
    // Here, we'll use a placeholder example
    const fetchedRadios: Radio[] = [
      // Add example radios here
    ];
    setRadios(fetchedRadios);
  };

  const updateRadio = (updatedRadio: Radio) => {
    setRadios((prevRadios) =>
      prevRadios.map((radio) =>
        radio.stationuuid === updatedRadio.stationuuid ? updatedRadio : radio
      )
    );
  };

  const deleteRadio = (radioId: string) => {
    setRadios((prevRadios) =>
      prevRadios.filter((radio) => radio.stationuuid !== radioId)
    );
  };

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const selectRadio = (radio: Radio) => {
    try {
      setCurrentRadio(radio);
      setIsPlaying(true);
    } catch (error) {
      setCurrentRadio(null);
      toast({
        title: 'An error occurred while selecting the radio.',
        description: error.message,
      });
    }
  };

  const adjustVolume = (newVolume: number[]) => {
    setVolume(newVolume);
  };

  const addToFavorites = (radio: Radio) => {
    if (!favorites.includes(radio)) {
      setFavorites([...favorites, radio]);
      radio.isFavorite = true;
      updateRadio(radio);
    }
  };

  const removeFromFavorites = (radio: Radio) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (favRadio) => favRadio.stationuuid !== radio.stationuuid
      )
    );
    radio.isFavorite = false;
    updateRadio(radio);
  };

  const isFavorite = (radio: Radio): boolean => {
    return favorites.some(
      (favRadio) => favRadio.stationuuid === radio.stationuuid
    );
  };

  useEffect(() => {
    readRadios();
  }, []);

  const contextValue: RadioContextProps = {
    radios,
    currentRadio,
    isPlaying,
    volume,
    favorites,
    playPause,
    selectRadio,
    adjustVolume,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    createRadio,
    readRadios,
    updateRadio,
    deleteRadio,
  };

  return (
    <RadioContext.Provider value={contextValue}>
      {children}
    </RadioContext.Provider>
  );
};
