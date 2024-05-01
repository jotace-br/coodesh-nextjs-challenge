'use client';
import { SidebarItem } from '@components/sidebar-item';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { ScrollArea } from '@components/ui/scroll-area';
import { Skeleton } from '@components/ui/skeleton';
import { useToast } from '@components/ui/use-toast';
import { fetchSearch } from 'api/fetchSearch';
import { Search } from 'lucide-react';
import { useState } from 'react';
import type { IStation } from 'types/IStation';

export function SidebarItems() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<IStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const fetchResults = async (query, page) => {
    try {
      setLoading(true);
      const limit = 10;
      const offset = page * limit;
      const data = await fetchSearch({ query, limit, offset });
      setResults((prevResults) => [...prevResults, ...data]);
    } catch (error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
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
      <form onSubmit={handleSearch}>
        <Input
          type='text'
          placeholder='Search radio stations...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          endIcon={Search}
        />
      </form>

      <ScrollArea className='h-full w-full pb-28 mb:pb-20 pr-4'>
        <ul className='space-y-4'>
          {loading
            ? [...Array(10)].map((_, i) => (
                <Skeleton key={i} className='w-full h-[150px] rounded-xl' />
              ))
            : results.map((station) => (
                <SidebarItem key={station.stationuuid} station={station} />
              ))}
        </ul>

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
