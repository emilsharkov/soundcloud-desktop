import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    AddSongToPlaylistResponse,
    AddSongToPlaylistResponseSchema,
    RemoveSongFromPlaylistResponse,
    RemoveSongFromPlaylistResponseSchema,
    ReorderPlaylistTracksResponse,
    ReorderPlaylistTracksResponseSchema,
} from '@/types/schemas';
import {
    AddSongToPlaylistQuery,
    AddSongToPlaylistQuerySchema,
    RemoveSongFromPlaylistQuery,
    RemoveSongFromPlaylistQuerySchema,
    ReorderPlaylistTracksQuery,
    ReorderPlaylistTracksQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePlaylistMutations = (playlistId: number) => {
    const queryClient = useQueryClient();

    const { mutate: addSongToPlaylist } = useTauriMutation<
        AddSongToPlaylistQuery,
        AddSongToPlaylistResponse
    >('add_song_to_playlist_command', {
        querySchema: AddSongToPlaylistQuerySchema,
        responseSchema: AddSongToPlaylistResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command', playlistId],
            });
            toast.success('Added to playlist');
        },
        onError: error => {
            console.error('Failed to add song to playlist', error);
            toast.error('Failed to add to playlist');
        },
    });

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
        },
    });

    const { mutate: reorderTracks } = useTauriMutation<
        ReorderPlaylistTracksQuery,
        ReorderPlaylistTracksResponse
    >('reorder_playlist_tracks_command', {
        querySchema: ReorderPlaylistTracksQuerySchema,
        responseSchema: ReorderPlaylistTracksResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlist_songs_command', playlistId],
            });
        },
        onError: error => {
            console.error('Failed to reorder tracks', error);
            toast.error('Failed to reorder tracks');
        },
    });

    return {
        addSongToPlaylist,
        removeSong,
        reorderTracks,
    };
};
