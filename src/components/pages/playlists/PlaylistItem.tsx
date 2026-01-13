import { SortableItem } from '@/components/ui/sortable-item';
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
import { Music } from 'lucide-react';
import { PlaylistImageGrid } from './PlaylistImageGrid';

interface PlaylistItemProps {
    playlist: PlaylistRow;
    onClick: () => void;
}

const PlaylistItem = (props: PlaylistItemProps) => {
    const { playlist, onClick } = props;
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

    return (
        <SortableItem
            id={id}
            className='flex flex-row items-center gap-4 p-4 rounded-lg hover:bg-accent/50 cursor-grab active:cursor-grabbing transition-colors group'
        >
            <div
                onClick={onClick}
                className='flex flex-row items-center gap-4 flex-1 cursor-pointer'
            >
                <div className='size-16 min-w-16 min-h-16 bg-accent rounded-lg flex items-center justify-center overflow-hidden'>
                    {firstFourTracks.length > 0 ? (
                        <PlaylistImageGrid tracks={firstFourTracks} />
                    ) : (
                        <Music className='w-8 h-8 text-tertiary' />
                    )}
                </div>
                <div className='flex flex-col flex-1 min-w-0'>
                    <p className='text-secondary font-medium truncate'>
                        {name}
                    </p>
                </div>
            </div>
        </SortableItem>
    );
};

export { PlaylistItem };
