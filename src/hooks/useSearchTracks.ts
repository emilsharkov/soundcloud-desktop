import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useTauriInfiniteQuery } from '@/hooks/useTauriInfiniteQuery';
import { Track, Tracks, TracksSchema } from '@/types/schemas';
import {
    SearchTracksQuery,
    SearchTracksQuerySchema,
} from '@/types/schemas/query';

interface UseSearchTracksOptions {
    enabled: boolean;
    limit?: number;
}

const useSearchTracks = (query: string, options: UseSearchTracksOptions) => {
    const {
        data,
        error,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useTauriInfiniteQuery<SearchTracksQuery, Track, Tracks>(
        'search_tracks',
        { q: query },
        {
            enabled: options.enabled,
            limit: options.limit ?? 20,
            querySchema: SearchTracksQuerySchema,
            responseSchema: TracksSchema,
        }
    );

    const { loadMoreRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    return {
        data,
        error,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        loadMoreRef,
    };
};

export { useSearchTracks };
