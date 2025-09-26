import { Song } from '@/components/Song/Song';
import { useTauriInvoke } from '@/hooks/useTauriInvoke';
import { TracksQuery } from '@/models/query';
import { TrackRow } from '@/models/response';

const Library = () => {
    const { data: tracks } = useTauriInvoke<TracksQuery, TrackRow[]>(
        'get_local_tracks'
    );

    console.log('tracks', tracks);

    return (
        <div className='flex flex-col gap-4 p-4'>
            {tracks?.map((track: TrackRow) => (
                <Song key={track.id?.toString()} track={track.data} />
            ))}
        </div>
    );
};

export { Library };
