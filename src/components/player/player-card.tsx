'use client';
import { Badge } from '@components/ui/badge';
import { Label } from '@components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { cn } from '@utils/shadcn-utils';
import { useRadio } from 'contexts/radio-context';
import { AudioLines, Heart } from 'lucide-react';
import Image from 'next/image';
import { MouseEvent } from 'react';
import type { IStation } from 'types/IStation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SidebarItemProps {
  station: IStation;
  className?: string;
  showTags?: boolean;
}

export function PlayerCard({
  station,
  className,
  showTags = false,
}: SidebarItemProps) {
  const { selectRadio, isFavorite, removeFromFavorites, addToFavorites } =
    useRadio();

  const handleSelectStation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    selectRadio(station);
  };

  const handleAddToFavorites = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isFavorite(station)) {
      removeFromFavorites(station);
    } else {
      addToFavorites(station);
    }
  };

  return (
    <div className='relative'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              onClick={handleSelectStation}
              className={cn(
                'flex flex-col flex-wrap text-pretty w-full max-h-[200px] gap-1 p-2 pb-4 hover:shadow-md hover:cursor-pointer hover:bg-primary transition-all',
                className
              )}
            >
              <CardHeader className='w-full flex flex-row items-start gap-2 p-0 z-10 select-none'>
                <div className='flex items-center justify-center rounded-md bg-primary/20 w-[50px] h-[50px] flex-shrink-0'>
                  {station.favicon ? (
                    <Image
                      src={station?.favicon}
                      alt={station?.name}
                      width={50}
                      height={50}
                      className='aspect-square object-contain p-0.5 rounded-md'
                    />
                  ) : (
                    <AudioLines size={20} />
                  )}
                </div>

                <CardTitle
                  className='text-base text-pretty first-letter:uppercase'
                  style={{ marginTop: 0 }}
                >
                  {station.name.replaceAll(' ', '')
                    ? station.name
                    : 'Unnamed station'}
                </CardTitle>
              </CardHeader>

              <CardContent className='w-full px-0 space-y-1 select-none'>
                <Label className='line-clamp-3 leading-snug'>
                  {station.country} {station.state && ` / ${station.state}`}{' '}
                  {station.language && (
                    <span className='capitalize'>({station.language})</span>
                  )}
                </Label>

                {showTags && !!station.tags.length && (
                  <div className='flex gap-2 flex-wrap pt-2'>
                    {station.tags
                      .split(',')
                      .splice(0, 2)
                      .map((tag) => (
                        <Badge
                          className='capitalize shadow-sm select-none text-center'
                          variant='secondary'
                          key={tag}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to listen</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className='absolute right-2 bottom-3 bg-transparent p-1'
              onClick={handleAddToFavorites}
            >
              <span className='sr-only'>
                {isFavorite(station)
                  ? `Remove ${station.name} from favorites`
                  : `Add ${station.name} to favorites`}
              </span>
              <Heart
                size='20'
                className={`cursor-pointer hover:scale-105 ${
                  isFavorite(station) ? 'fill-red-600 text-red-600' : ''
                }`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isFavorite(station)
                ? `Remove ${station.name} from favorites`
                : `Add ${station.name} to favorites`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
