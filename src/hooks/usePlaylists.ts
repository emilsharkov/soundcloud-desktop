import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetPlaylistsResponse,
    GetPlaylistsResponseSchema,
} from '@/types/schemas';
import {
    GetPlaylistsQuery,
    GetPlaylistsQuerySchema,
} from '@/types/schemas/query';

interface UsePlaylistsOptions {
    enabled?: boolean;
}

const usePlaylists = (options?: UsePlaylistsOptions) => {
    return useTauriQuery<GetPlaylistsQuery, GetPlaylistsResponse>(
        'get_playlists_command',
        undefined,
        {
            querySchema: GetPlaylistsQuerySchema,
            responseSchema: GetPlaylistsResponseSchema,
            enabled: options?.enabled,
        }
    );
};

export { usePlaylists };
