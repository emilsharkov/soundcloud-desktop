import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    RemoveSongFromPlaylistResponse,
    RemoveSongFromPlaylistResponseSchema,
} from '@/types/schemas';
import {
    RemoveSongFromPlaylistQuery,
    RemoveSongFromPlaylistQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSettingsContext } from './Settings';

interface SettingsRemoveFromPlaylistProps {
    playlistId: number;
}

const SettingsRemoveFromPlaylist = (props: SettingsRemoveFromPlaylistProps) => {
    const { playlistId } = props;
    const { trackId } = useSettingsContext();
    const queryClient = useQueryClient();

    const { mutate: removeSong } = useTauriMutation<
        RemoveSongFromPlaylistQuery,
        RemoveSongFromPlaylistResponse
    >('remove_song_from_playlist_command', {
        querySchema: RemoveSongFromPlaylistQuerySchema,
        responseSchema: RemoveSongFromPlaylistResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command', playlistId],
            });
            toast.success('Removed from playlist');
        },
        onError: () => {
            toast.error('Failed to remove from playlist');
        },
    });

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeSong({
            playlistId,
            trackId,
        });
    };

    return (
        <DropdownMenuItem onClick={handleClick} variant='destructive'>
            Remove from playlist
        </DropdownMenuItem>
    );
};

export { SettingsRemoveFromPlaylist };
