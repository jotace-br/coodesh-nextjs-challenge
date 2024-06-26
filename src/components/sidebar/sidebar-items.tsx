'use client';
import { PlayerCard } from '@components/player/player-card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { ScrollArea } from '@components/ui/scroll-area';
import { Skeleton } from '@components/ui/skeleton';
import { fetchSearch } from 'api/fetchSearch';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { IStation } from 'types/IStation';

export function SidebarItems() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<IStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const fetchResults = async (query: string, page: number) => {
    try {
      setLoading(true);
      const limit = 10;
      const offset = page * limit;
      const data = await fetchSearch({ query, limit, offset });
      setResults((prevResults) => [...prevResults, ...data]);
    } catch (error) {
      toast.error('Uh oh! Something went wrong.', {
        description: error.message,
      });
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (
    event?:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event) {
      event.preventDefault();
    }
    setResults([]);
    setPage(0);

    await fetchResults(searchQuery, 0);
  };

  const loadMoreResults = async () => {
    setPage((prevPage) => prevPage + 1);
    await fetchResults(searchQuery, page + 1);
  };

  return (
    <>
      <form onSubmit={handleSearch} className='flex gap-2'>
        <Input
          type='text'
          name='radio-search'
          placeholder='Search radios...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <Button type='submit' className='bg-card'>
          <span className='sr-only'>Search radio</span>
          <Search />
        </Button>
      </form>

      <ScrollArea className='h-full w-full pb-28 mb:pb-20 transition-all duration-300 hover:pr-4'>
        <div className='space-y-4'>
          {loading
            ? [...Array(10)].map((_, i) => (
                <Skeleton key={i} className='w-full h-[150px] rounded-xl' />
              ))
            : results.map((station) => (
                <PlayerCard key={station.stationuuid} station={station} />
              ))}
        </div>

        {results.length >= 10 && (
          <Button
            variant='outline'
            className='w-full mt-4'
            onClick={loadMoreResults}
          >
            Load More
          </Button>
        )}
      </ScrollArea>
    </>
  );
}
