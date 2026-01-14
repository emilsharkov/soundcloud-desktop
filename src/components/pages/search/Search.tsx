import { Button } from '@/components/ui/button';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useTauriInfiniteQuery } from '@/hooks/useTauriInfiniteQuery';
import { useNav } from '@/providers/NavProvider';
import { useOffline } from '@/providers/OfflineProvider';
import { Track, Tracks, TracksSchema } from '@/types/schemas';
import {
    SearchTracksQuery,
    SearchTracksQuerySchema,
} from '@/types/schemas/query';
import { parseError } from '@/utils/parseError';
import { Loader2, RefreshCw } from 'lucide-react';
import { SearchSong } from './SearchSong';

const Search = () => {
    const { selectedSearch } = useNav();
    const { isOffline, retryConnection, isRetrying } = useOffline();

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
        {
            q: selectedSearch ?? '',
        },
        {
            enabled: !isOffline && selectedSearch !== undefined,
            limit: 20,
            querySchema: SearchTracksQuerySchema,
            responseSchema: TracksSchema,
        }
    );

    const { loadMoreRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    // Flatten all pages into a single array of tracks
    const tracks = data?.pages.flatMap(page => page.collection) ?? [];
    const trackIds = tracks.map(track => track.id as number);

    const errorInfo = parseError(error);
    const isNetworkError = errorInfo?.type === 'network';

    const handleRetry = async () => {
        await retryConnection();
        // Refetch the search query after retrying connection
        if (selectedSearch) {
            refetch();
        }
    };

    // Show offline/retry UI if offline or network error
    if (isOffline || isNetworkError) {
        return (
            <div className='flex flex-col items-center justify-center gap-4 p-8 min-h-[400px]'>
                <div className='text-center'>
                    <h2 className='text-xl font-semibold mb-2'>
                        No Internet Connection
                    </h2>
                    <p className='text-tertiary mb-6'>
                        Please check your internet connection and try again.
                    </p>
                </div>
                <Button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className='gap-2'
                >
                    <RefreshCw
                        className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`}
                    />
                    {isRetrying ? 'Checking connection...' : 'Retry Connection'}
                </Button>
            </div>
        );
    }

    // Show other errors
    if (isError && error && !isNetworkError) {
        return (
            <div className='flex flex-col items-center justify-center gap-4 p-8 min-h-[400px]'>
                <div className='text-center'>
                    <h2 className='text-xl font-semibold mb-2'>Error</h2>
                    <p className='text-tertiary'>
                        {errorInfo?.message ||
                            error.message ||
                            'An error occurred'}
                    </p>
                </div>
            </div>
        );
    }

    // Create queue context for search
    const queueContext = {
        tab: 'search' as const,
        trackIds,
        searchQuery: selectedSearch,
    };

    return (
        <div className='flex flex-col gap-4 p-4'>
            {tracks.map((track: Track) => (
                <SearchSong
                    key={track.id}
                    track={track}
                    queueContext={queueContext}
                />
            ))}

            {/* Load more trigger */}
            <div ref={loadMoreRef} className='flex justify-center py-4'>
                {isFetchingNextPage && (
                    <Loader2 className='w-6 h-6 animate-spin text-tertiary' />
                )}
            </div>
        </div>
    );
};

export { Search };
