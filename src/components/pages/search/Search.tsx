import { useNavContext } from '@/context/nav/NavContext';
import { useTauriQuery } from '@/hooks/data/query/useTauriQuery';
import { TracksQuery } from '@/models/query';
import { PagingCollection, Track } from '@/models/response';
import { SearchSong } from './SearchSong';

const Search = () => {
    const { selectedSearch } = useNavContext();
    const { data: tracks } = useTauriQuery<
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
                <SearchSong key={track.id} track={track} />
            ))}
        </div>
    );
};

export { Search };
