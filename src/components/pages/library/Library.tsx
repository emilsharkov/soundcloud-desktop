import { useTauriQuery } from '@/hooks/data/query/useTauriQuery';
import { TracksQuery } from '@/models/query';
import { TrackRow } from '@/models/response';
import { LibrarySong } from './LibrarySong';

const Library = () => {
    const { data: tracks } = useTauriQuery<TracksQuery, TrackRow[]>(
        'get_local_tracks'
    );

    return (
        <div className='flex flex-col gap-4 p-4'>
            {tracks?.map((trackRow: TrackRow) => (
                <LibrarySong key={trackRow.id} trackRow={trackRow} />
            ))}
        </div>
    );
};

export { Library };
