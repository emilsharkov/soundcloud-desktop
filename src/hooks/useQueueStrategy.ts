import { useAudio } from '@/providers/AudioProvider';
import { useNav } from '@/providers/NavProvider';
import { Tab } from '@/types/tabs';
import { useCallback } from 'react';

export type QueueContext = {
    tab: Tab;
    trackIds: number[];
    searchQuery?: string;
};

/**
 * Hook to handle queuing strategies based on tab context.
 *
 * Strategies:
 * - Search: Queue all tracks on current page. On new search, reset queue except current song.
 * - Library: Queue all library tracks.
 * - Playlist: Queue all playlist tracks.
 *
 * If switching tabs and playing a different song, reset queue before playing.
 */
export const useQueueStrategy = (context?: QueueContext) => {
    const { setQueue, selectedTrackId } = useAudio();
    const {
        selectedTab,
        lastQueuedTab,
        setLastQueuedTab,
        selectedSearch,
        lastQueuedSearch,
        setLastQueuedSearch,
    } = useNav();

    const playTrack = useCallback(
        (trackId: number) => {
            const currentTab = context?.tab ?? selectedTab;
            const trackIds = context?.trackIds ?? [];

            // Check if we're switching tabs
            const isTabSwitch =
                lastQueuedTab !== null && lastQueuedTab !== currentTab;

            // For search: check if search query changed
            const isNewSearch =
                currentTab === 'search' &&
                lastQueuedTab === 'search' &&
                context?.searchQuery !== undefined &&
                context.searchQuery !== lastQueuedSearch;

            // Build the new queue with selected track first
            let newQueue: number[];
            if (trackIds.length > 0) {
                const targetIndex = trackIds.indexOf(trackId);
                if (targetIndex !== -1) {
                    // Reorder so selected track is first
                    newQueue = [
                        ...trackIds.slice(targetIndex),
                        ...trackIds.slice(0, targetIndex),
                    ];
                } else {
                    // Track not in list, add it at the beginning
                    newQueue = [
                        trackId,
                        ...trackIds.filter(id => id !== trackId),
                    ];
                }
            } else {
                // No context tracks, just play this one
                newQueue = [trackId];
            }

            // Handle tab switch: completely reset queue
            if (isTabSwitch) {
                // Just use the new queue as-is (complete reset)
                setQueue(newQueue);
            } else if (isNewSearch) {
                // New search: reset queue except current playing song
                if (selectedTrackId && newQueue.includes(selectedTrackId)) {
                    // Current song is in new results: put it first, then rest of new queue
                    const filteredQueue = newQueue.filter(
                        id => id !== selectedTrackId
                    );
                    setQueue([selectedTrackId, ...filteredQueue]);
                } else if (selectedTrackId) {
                    // Current song not in new results: keep it first, then new queue
                    setQueue([selectedTrackId, ...newQueue]);
                } else {
                    // No current song: just set new queue
                    setQueue(newQueue);
                }
            } else {
                // Same tab, same context: just set new queue
                setQueue(newQueue);
            }

            // Update last queued tab and search
            setLastQueuedTab(currentTab);
            if (currentTab === 'search' && context?.searchQuery !== undefined) {
                setLastQueuedSearch(context.searchQuery);
            }
        },
        [
            context,
            selectedTab,
            lastQueuedTab,
            setLastQueuedTab,
            selectedSearch,
            lastQueuedSearch,
            setLastQueuedSearch,
            setQueue,
            selectedTrackId,
        ]
    );

    return { playTrack };
};
