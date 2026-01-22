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

export const useRemoveSongFromPlaylistMutation = (playlistId: number) => {
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

    return {
        removeSong,
    };
};
