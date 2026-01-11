import { Settings } from '@/components/Song/Settings/Settings';
import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetLocalTrackResponse,
    GetLocalTrackResponseSchema,
    GetSongImageResponse,
    GetSongImageResponseSchema,
    PlaylistSongRow,
} from '@/types/schemas';
import {
    GetLocalTrackQuery,
    GetLocalTrackQuerySchema,
    GetSongImageQuery,
    GetSongImageQuerySchema,
} from '@/types/schemas/query';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

interface PlaylistSongProps {
    playlistSong: PlaylistSongRow;
    onRemove: () => void;
}

const PlaylistSong = (props: PlaylistSongProps) => {
    const { playlistSong, onRemove } = props;
    const { track_id, title, artist } = playlistSong;

    const { data: localTrack, isLoading: isLoadingTrack } = useTauriQuery<
        GetLocalTrackQuery,
        GetLocalTrackResponse
    >(
        'get_local_track',
        { id: track_id },
        {
            querySchema: GetLocalTrackQuerySchema,
            responseSchema: GetLocalTrackResponseSchema,
        }
    );

    const { data: artwork, isLoading: isLoadingArtwork } = useTauriQuery<
        GetSongImageQuery,
        GetSongImageResponse
    >(
        'get_song_image',
        { id: track_id },
        {
            querySchema: GetSongImageQuerySchema,
            responseSchema: GetSongImageResponseSchema,
            enabled: localTrack !== undefined,
        }
    );

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: track_id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (isLoadingTrack || isLoadingArtwork || !artwork || !localTrack) {
        return <SongSkeleton />;
    }

    const buttonBar = (
        <>
            <button
                className='p-1 hover:bg-destructive/10 rounded transition-colors'
                onClick={e => {
                    e.stopPropagation();
                    onRemove();
                }}
                title='Remove from playlist'
            >
                <X className='w-4 h-4 text-destructive' />
            </button>
            <Settings trackId={track_id} title={title} artist={artist} />
        </>
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className='cursor-grab active:cursor-grabbing'
        >
            <Song
                key={track_id}
                trackId={track_id}
                title={title}
                artist={artist}
                artwork={artwork}
                waveform={localTrack.waveform}
                buttonBar={buttonBar}
            />
        </div>
    );
};

export { PlaylistSong };
