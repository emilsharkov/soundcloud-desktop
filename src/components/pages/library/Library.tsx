import { useTauriQuery } from '@/hooks/useTauriQuery';
import { GetLocalTracksResponseSchema, TrackRow } from '@/types/schemas';
import { GetLocalTracksQuerySchema } from '@/types/schemas/query';
import { LibrarySong } from './LibrarySong';

const Library = () => {
    const { data: tracks } = useTauriQuery<undefined, TrackRow[]>(
        'get_local_tracks',
        undefined,
        {
            querySchema: GetLocalTracksQuerySchema,
            responseSchema: GetLocalTracksResponseSchema,
        }
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
