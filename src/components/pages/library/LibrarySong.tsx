import { Settings } from '@/components/Song/Settings/Settings';
import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetSongImageResponse,
    GetSongImageResponseSchema,
    TrackRow,
} from '@/types/schemas';
import {
    GetSongImageQuery,
    GetSongImageQuerySchema,
} from '@/types/schemas/query';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check } from 'lucide-react';

interface LibrarySongProps {
    trackRow: TrackRow;
}

const LibrarySong = (props: LibrarySongProps) => {
    const { trackRow } = props;
    const { id, title, artist, waveform } = trackRow;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const { data: artwork, isLoading } = useTauriQuery<
        GetSongImageQuery,
        GetSongImageResponse
    >(
        'get_song_image',
        { id },
        {
            querySchema: GetSongImageQuerySchema,
            responseSchema: GetSongImageResponseSchema,
        }
    );

    if (isLoading || !artwork) {
        return <SongSkeleton />;
    }

    const buttonBar = (
        <>
            <Check className='w-4 h-4 text-secondary' />
            <Settings trackId={id} title={title} artist={artist} />
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
                key={id}
                trackId={id}
                title={title}
                artist={artist}
                artwork={artwork}
                waveform={waveform}
                buttonBar={buttonBar}
            />
        </div>
    );
};

export { LibrarySong };
