import { useRadio } from 'contexts/radio-context';
import { LoaderCircle, Pause, Play } from 'lucide-react';
import { IRadio } from 'types/IRadio';

interface PlayFromTableProps {
  rowData: IRadio;
}

export function PlayFromTable({ rowData }: PlayFromTableProps) {
  const { playPause, isFetching, currentRadio, selectRadio, isPlaying } =
    useRadio();

  const handlePlayPause = () => {
    if (isFetching) {
      return;
    }

    if (currentRadio && currentRadio.stationuuid === rowData.stationuuid) {
      return playPause();
    }

    selectRadio(rowData);
  };

  const renderPlayPauseButton = () => {
    if (isFetching && rowData.stationuuid === currentRadio?.stationuuid) {
      return (
        <LoaderCircle
          strokeWidth={2.5}
          className='animate-spin text-primary/80'
        />
      );
    }

    if (currentRadio?.stationuuid === rowData.stationuuid) {
      return isPlaying ? (
        <>
          <Pause fill='text-primary/80' />
          <span className='sr-only'>Pause radio</span>
        </>
      ) : (
        <>
          <Play fill='text-primary/80' />
          <span className='sr-only'>Play radio</span>
        </>
      );
    }

    return <Play fill='text-primary/80' />;
  };

  return (
    <div className='flex justify-center items-center gap-2'>
      <button
        onClick={handlePlayPause}
        className={`flex rounded-full bg-gray-50 text-primary/80 transition-transform hover:bg-gray-300 hover:text-primary/80 hover:scale-105 cursor-pointer p-2 ${
          isFetching ? 'cursor-not-allowed' : ''
        }`}
        disabled={isFetching}
      >
        {renderPlayPauseButton()}
      </button>
    </div>
  );
}
