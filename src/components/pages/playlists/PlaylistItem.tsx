import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetPlaylistSongsResponse,
    GetPlaylistSongsResponseSchema,
    PlaylistRow,
} from '@/types/schemas';
import {
    GetPlaylistSongsQuery,
    GetPlaylistSongsQuerySchema,
} from '@/types/schemas/query';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Music } from 'lucide-react';
import { PlaylistImageGrid } from './PlaylistImageGrid';

interface PlaylistItemProps {
    playlist: PlaylistRow;
    onClick: () => void;
    onDelete: () => void;
}

const PlaylistItem = (props: PlaylistItemProps) => {
    const { playlist, onClick, onDelete } = props;
    const { name, id } = playlist;

    const { data: songs } = useTauriQuery<
        GetPlaylistSongsQuery,
        GetPlaylistSongsResponse
    >(
        'get_playlist_songs_command',
        { id },
        {
            querySchema: GetPlaylistSongsQuerySchema,
            responseSchema: GetPlaylistSongsResponseSchema,
        }
    );

    const firstFourTracks = songs?.slice(0, 4) ?? [];

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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className='flex flex-row items-center gap-4 p-4 rounded-lg hover:bg-accent/50 cursor-grab active:cursor-grabbing transition-colors group'
            onClick={onClick}
        >
            <div className='size-16 min-w-16 min-h-16 bg-accent rounded-lg flex items-center justify-center overflow-hidden'>
                {firstFourTracks.length > 0 ? (
                    <PlaylistImageGrid tracks={firstFourTracks} />
                ) : (
                    <Music className='w-8 h-8 text-tertiary' />
                )}
            </div>
            <div className='flex flex-col flex-1 min-w-0'>
                <p className='text-secondary font-medium truncate'>{name}</p>
            </div>
            <button
                className='opacity-0 group-hover:opacity-100 px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded transition-opacity'
                onClick={e => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                Delete
            </button>
        </div>
    );
};

export { PlaylistItem };
