import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { useRadio } from 'contexts/radio-context';
import { Heart } from 'lucide-react';

export function PlayerAddRadioToFavorites() {
  const { currentRadio, isFavorite, removeFromFavorites, addToFavorites } =
    useRadio();

  const handleAddToFavorites = () => {
    if (currentRadio) {
      if (isFavorite(currentRadio)) {
        removeFromFavorites(currentRadio);
      } else {
        addToFavorites(currentRadio);
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Heart
            size='20'
            className={`cursor-pointer hover:scale-105 ${
              isFavorite(currentRadio) ? 'fill-red-600 text-red-600' : ''
            }`}
            onClick={handleAddToFavorites}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {!isFavorite(currentRadio)
              ? 'Add to favorites'
              : 'Remove from favorites'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
