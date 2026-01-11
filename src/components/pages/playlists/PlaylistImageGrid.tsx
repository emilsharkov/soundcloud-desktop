import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetSongImageResponse,
    GetSongImageResponseSchema,
    PlaylistSongRow,
} from '@/types/schemas';
import {
    GetSongImageQuery,
    GetSongImageQuerySchema,
} from '@/types/schemas/query';

interface PlaylistImageGridProps {
    tracks: PlaylistSongRow[];
}

const TrackImage = ({ trackId }: { trackId: number }) => {
    const { data: image, isLoading } = useTauriQuery<
        GetSongImageQuery,
        GetSongImageResponse
    >(
        'get_song_image',
        { id: trackId },
        {
            querySchema: GetSongImageQuerySchema,
            responseSchema: GetSongImageResponseSchema,
        }
    );

    if (isLoading || !image) {
        return <div className='w-full h-full bg-accent' />;
    }

    return <img src={image} alt='' className='w-full h-full object-cover' />;
};

const PlaylistImageGrid = (props: PlaylistImageGridProps) => {
    const { tracks } = props;
    const firstFourTracks = tracks.slice(0, 4);

    if (firstFourTracks.length === 0) {
        return null;
    }

    // Create grid layout based on number of tracks
    const getGridClass = () => {
        if (firstFourTracks.length === 1) {
            return 'grid-cols-1 grid-rows-1';
        } else if (firstFourTracks.length === 2) {
            return 'grid-cols-2 grid-rows-1';
        } else {
            return 'grid-cols-2 grid-rows-2';
        }
    };

    return (
        <div className={`grid ${getGridClass()} w-full h-full`}>
            {firstFourTracks.map((track, index) => (
                <TrackImage key={track.track_id} trackId={track.track_id} />
            ))}
        </div>
    );
};

export { PlaylistImageGrid };
