import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    AddSongToPlaylistResponse,
    AddSongToPlaylistResponseSchema,
    CreatePlaylistResponse,
    CreatePlaylistResponseSchema,
} from '@/types/schemas';
import {
    AddSongToPlaylistQuery,
    AddSongToPlaylistQuerySchema,
    CreatePlaylistQuery,
    CreatePlaylistQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseAddToPlaylistMutationsOptions {
    onCreateSuccess?: () => void;
}

export const useAddToPlaylistMutations = (
    options: UseAddToPlaylistMutationsOptions = {}
) => {
    const queryClient = useQueryClient();
    const { onCreateSuccess } = options;

    const { mutate: addSongToPlaylist } = useTauriMutation<
        AddSongToPlaylistQuery,
        AddSongToPlaylistResponse
    >('add_song_to_playlist_command', {
        querySchema: AddSongToPlaylistQuerySchema,
        responseSchema: AddSongToPlaylistResponseSchema,
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command', variables.playlistId],
            });
            toast.success('Added to playlist');
        },
        onError: error => {
            console.error('Failed to add song to playlist', error);
            toast.error('Failed to add to playlist');
        },
    });

    const { mutate: createPlaylist } = useTauriMutation<
        CreatePlaylistQuery,
        CreatePlaylistResponse
    >('create_playlist_command', {
        querySchema: CreatePlaylistQuerySchema,
        responseSchema: CreatePlaylistResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlists_command'],
            });
            onCreateSuccess?.();
            toast.success('Playlist created successfully');
        },
        onError: error => {
            console.error('Failed to create playlist', error);
            toast.error('Failed to create playlist');
        },
    });

    return {
        addSongToPlaylist,
        createPlaylist,
    };
};
