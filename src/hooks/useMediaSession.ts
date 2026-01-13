import { useEffect, useRef } from 'react';

export interface MediaSessionMetadata {
    title: string;
    artist: string;
    artwork: string;
}

export interface MediaSessionActions {
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

export interface UseMediaSessionOptions {
    metadata: MediaSessionMetadata | null;
    paused: boolean;
    duration: number;
    playbackTime: number;
    actions: MediaSessionActions;
}

export const useMediaSession = (options: UseMediaSessionOptions) => {
    const { metadata, paused, duration, playbackTime, actions } = options;
    const actionsRef = useRef(actions);
    const metadataRef = useRef(metadata);

    // Keep refs up to date
    useEffect(() => {
        actionsRef.current = actions;
        metadataRef.current = metadata;
    }, [actions, metadata]);

    // Set up Media Session metadata
    useEffect(() => {
        if (!('mediaSession' in navigator)) {
            return;
        }

        const mediaSession = navigator.mediaSession;

        if (metadata) {
            mediaSession.metadata = new MediaMetadata({
                title: metadata.title,
                artist: metadata.artist,
                artwork: [
                    {
                        src: metadata.artwork,
                        sizes: '512x512',
                        type: 'image/jpeg',
                    },
                ],
            });
        } else {
            mediaSession.metadata = null;
        }
    }, [metadata]);

    // Set up action handlers
    useEffect(() => {
        if (!('mediaSession' in navigator)) {
            return;
        }

        const mediaSession = navigator.mediaSession;

        // Play action
        mediaSession.setActionHandler('play', () => {
            actionsRef.current.onPlay();
        });

        // Pause action
        mediaSession.setActionHandler('pause', () => {
            actionsRef.current.onPause();
        });

        // Next track action
        mediaSession.setActionHandler('nexttrack', () => {
            actionsRef.current.onNext();
        });

        // Previous track action
        mediaSession.setActionHandler('previoustrack', () => {
            actionsRef.current.onPrevious();
        });

        // Cleanup
        return () => {
            try {
                mediaSession.setActionHandler('play', null);
                mediaSession.setActionHandler('pause', null);
                mediaSession.setActionHandler('nexttrack', null);
                mediaSession.setActionHandler('previoustrack', null);
            } catch {
                // Ignore errors during cleanup
            }
        };
    }, []);

    // Update playback state
    useEffect(() => {
        if (!('mediaSession' in navigator)) {
            return;
        }

        const mediaSession = navigator.mediaSession;

        if (metadata && duration > 0) {
            try {
                mediaSession.setPositionState({
                    duration,
                    playbackRate: 1.0,
                    position: playbackTime,
                });
            } catch {
                // setPositionState may not be supported in all browsers
            }
        }
    }, [metadata, duration, playbackTime]);

    // Update playback state indicator
    useEffect(() => {
        if (!('mediaSession' in navigator)) {
            return;
        }

        const mediaSession = navigator.mediaSession;
        mediaSession.playbackState = paused ? 'paused' : 'playing';
    }, [paused]);
};
