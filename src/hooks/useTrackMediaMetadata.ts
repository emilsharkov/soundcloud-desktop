import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetTrackMediaMetadataQuery,
    GetTrackMediaMetadataQuerySchema,
} from '@/types/schemas/query';
import {
    TrackMediaMetadata,
    TrackMediaMetadataSchema,
} from '@/types/schemas/response';

const useTrackMediaMetadata = (trackId: number | null) => {
    return useTauriQuery<GetTrackMediaMetadataQuery, TrackMediaMetadata>(
        'get_track_media_metadata',
        { id: trackId! },
        {
            querySchema: GetTrackMediaMetadataQuerySchema,
            responseSchema: TrackMediaMetadataSchema,
            enabled: trackId !== null,
        }
    );
};

export { useTrackMediaMetadata };
