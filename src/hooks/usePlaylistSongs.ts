import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetPlaylistSongsResponse,
    GetPlaylistSongsResponseSchema,
} from '@/types/schemas';
import {
    GetPlaylistSongsQuery,
    GetPlaylistSongsQuerySchema,
} from '@/types/schemas/query';

interface UsePlaylistSongsOptions {
    enabled?: boolean;
}

const usePlaylistSongs = (
    playlistId: number,
    options?: UsePlaylistSongsOptions
) => {
    return useTauriQuery<GetPlaylistSongsQuery, GetPlaylistSongsResponse>(
        'get_playlist_songs_command',
        { id: playlistId },
        {
            querySchema: GetPlaylistSongsQuerySchema,
            responseSchema: GetPlaylistSongsResponseSchema,
            enabled: options?.enabled,
        }
    );
};

export { usePlaylistSongs };
