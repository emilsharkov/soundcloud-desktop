import { useTauriQuery } from '@/hooks/useTauriQuery';
import { TrackRow } from '@/types/schemas';
import { LibrarySong } from './LibrarySong';

const Library = () => {
    const { data: tracks } = useTauriQuery<undefined, TrackRow[]>(
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
