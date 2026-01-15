import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetLocalTracksResponse,
    GetLocalTracksResponseSchema,
} from '@/types/schemas';
import { GetLocalTracksQuerySchema } from '@/types/schemas/query';

interface UseLocalTracksOptions {
    enabled?: boolean;
}

const useLocalTracks = (options?: UseLocalTracksOptions) => {
    return useTauriQuery<undefined, GetLocalTracksResponse>(
        'get_local_tracks',
        undefined,
        {
            querySchema: GetLocalTracksQuerySchema,
            responseSchema: GetLocalTracksResponseSchema,
            enabled: options?.enabled,
        }
    );
};

export { useLocalTracks };
