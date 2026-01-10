import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    threshold?: number;
    rootMargin?: string;
}

export const useInfiniteScroll = ({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold = 0.1,
    rootMargin = '100px',
}: UseInfiniteScrollOptions) => {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleObserver, {
            threshold,
            rootMargin,
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [handleObserver, threshold, rootMargin]);

    return { loadMoreRef };
};
