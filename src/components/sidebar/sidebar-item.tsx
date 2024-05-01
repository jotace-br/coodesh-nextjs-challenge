'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip';
import { toUpperCase } from '@utils/to-upper-case';
import { useRadio } from 'contexts/radio-context';
import { AudioLines } from 'lucide-react';
import type { IStation } from 'types/IStation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface SidebarItemProps {
  station: IStation;
}

export function SidebarItem({ station }: SidebarItemProps) {
  const { selectRadio } = useRadio();

  return (
    <li>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              onClick={() => selectRadio(station)}
              className='relative flex flex-col flex-wrap text-pretty w-full max-h-[200px] gap-2 p-2 hover:shadow-md hover:cursor-pointer hover:bg-primary transition-all'
            >
              <AudioLines size='20' className='absolute bottom-4 right-4' />
              <CardHeader className='p-2 z-10'>
                <CardTitle className='text-xl'>
                  {station.name.replaceAll(' ', '')
                    ? toUpperCase(station.name)
                    : 'Unnamed station'}
                </CardTitle>
                <CardDescription>
                  {station.country}
                  {station.state && ` | ${station.state}`}
                </CardDescription>
              </CardHeader>
              {station.language && (
                <CardContent className='px-2'>
                  <p className='text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    {station.language &&
                      `Language: ${toUpperCase(station.language)}`}
                  </p>
                </CardContent>
              )}
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to listen</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
