import { Button } from '@/components/ui/button';
import { useNavContext } from '@/context/nav/NavContext';
import { useOfflineContext } from '@/context/offline/OfflineContext';
import { useTauriInfiniteQuery } from '@/hooks/data/query/useTauriInfiniteQuery';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SearchArgs } from '@/models/query';
import { PagingCollection, Track } from '@/models/response';
import { Loader2, RefreshCw } from 'lucide-react';
import { SearchSong } from './SearchSong';

const Search = () => {
    const { selectedSearch } = useNavContext();
    const { isOffline, retryConnection, isRetrying } = useOfflineContext();

    const {
        data,
        error,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useTauriInfiniteQuery<SearchArgs, Track, PagingCollection<Track>>(
        'search_tracks',
        {
            q: selectedSearch ?? '',
        },
        {
            enabled: !isOffline && selectedSearch !== undefined,
            limit: 20,
        }
    );

    const { loadMoreRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    // Flatten all pages into a single array of tracks
    const tracks = data?.pages.flatMap(page => page.collection) ?? [];

    // Parse error to check if it's a network error
    const parseError = (
        error: Error | null
    ): { type: string; message: string } | null => {
        if (!error?.message) return null;

        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(error.message);
            if (parsed && typeof parsed === 'object' && 'type' in parsed) {
                return {
                    type: parsed.type,
                    message: parsed.message || error.message,
                };
            }
        } catch {
            // If not JSON, check if it's a legacy format
            if (error.message.includes('NETWORK_ERROR')) {
                return {
                    type: 'network',
                    message: error.message,
                };
            }
        }

        return {
            type: 'other',
            message: error.message,
        };
    };

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

    return (
        <div className='flex flex-col gap-4 p-4'>
            {tracks.map((track: Track) => (
                <SearchSong key={track.id} track={track} />
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
