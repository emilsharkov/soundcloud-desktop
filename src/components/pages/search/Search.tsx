import { Song } from '@/components/Song/Song';
import { useNavContext } from '@/context/nav/NavContext';
import { useTauriInvoke } from '@/hooks/useTauriInvoke';
import { TracksQuery } from '@/models/query';
import { PagingCollection, Track } from '@/models/response';

const Search = () => {
    const { selectedSearch } = useNavContext();
    const { data: tracks } = useTauriInvoke<
        TracksQuery,
        PagingCollection<Track>
    >(
        'search_tracks',
        {
            q: selectedSearch ?? '',
        },
        {
            enabled: selectedSearch !== undefined,
        }
    );

    return (
        <div className='flex flex-col gap-4 p-4'>
            {tracks?.collection.map((track: Track) => (
                <Song key={track.id?.toString()} track={track} />
            ))}
        </div>
    );
};

export { Search };
