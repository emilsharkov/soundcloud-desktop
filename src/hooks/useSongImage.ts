import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetSongImageResponse,
    GetSongImageResponseSchema,
} from '@/types/schemas';
import {
    GetSongImageQuery,
    GetSongImageQuerySchema,
} from '@/types/schemas/query';

interface UseSongImageOptions {
    enabled?: boolean;
}

const useSongImage = (trackId: number, options?: UseSongImageOptions) => {
    return useTauriQuery<GetSongImageQuery, GetSongImageResponse>(
        'get_song_image',
        { id: trackId },
        {
            querySchema: GetSongImageQuerySchema,
            responseSchema: GetSongImageResponseSchema,
            enabled: options?.enabled,
        }
    );
};

export { useSongImage };
