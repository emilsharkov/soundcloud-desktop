import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetLocalTrackResponse,
    GetLocalTrackResponseSchema,
} from '@/types/schemas';
import {
    GetLocalTrackQuery,
    GetLocalTrackQuerySchema,
} from '@/types/schemas/query';

interface UseLocalTrackRowOptions {
    enabled?: boolean;
}

const useLocalTrackRow = (
    trackId: number,
    options?: UseLocalTrackRowOptions
) => {
    return useTauriQuery<GetLocalTrackQuery, GetLocalTrackResponse>(
        'get_local_track',
        { id: trackId },
        {
            querySchema: GetLocalTrackQuerySchema,
            responseSchema: GetLocalTrackResponseSchema,
            enabled: options?.enabled,
        }
    );
};

export { useLocalTrackRow };
