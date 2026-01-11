import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    CreatePlaylistResponse,
    CreatePlaylistResponseSchema,
    DeletePlaylistResponse,
    DeletePlaylistResponseSchema,
    ReorderPlaylistsResponse,
    ReorderPlaylistsResponseSchema,
} from '@/types/schemas';
import {
    CreatePlaylistQuery,
    CreatePlaylistQuerySchema,
    DeletePlaylistQuery,
    DeletePlaylistQuerySchema,
    ReorderPlaylistsQuery,
    ReorderPlaylistsQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePlaylistsMutations = (
    onDeleteSuccess?: () => void,
    onCreateSuccess?: () => void
) => {
    const queryClient = useQueryClient();

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

    const { mutate: deletePlaylist } = useTauriMutation<
        DeletePlaylistQuery,
        DeletePlaylistResponse
    >('delete_playlist_command', {
        querySchema: DeletePlaylistQuerySchema,
        responseSchema: DeletePlaylistResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlists_command'],
            });
            onDeleteSuccess?.();
            toast.success('Playlist deleted successfully');
        },
        onError: error => {
            console.error('Failed to delete playlist', error);
            toast.error('Failed to delete playlist');
        },
    });

    const { mutate: reorderPlaylists } = useTauriMutation<
        ReorderPlaylistsQuery,
        ReorderPlaylistsResponse
    >('reorder_playlists_command', {
        querySchema: ReorderPlaylistsQuerySchema,
        responseSchema: ReorderPlaylistsResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_playlists_command'],
            });
        },
        onError: error => {
            console.error('Failed to reorder playlists', error);
            toast.error('Failed to reorder playlists');
        },
    });

    return {
        createPlaylist,
        deletePlaylist,
        reorderPlaylists,
    };
};
