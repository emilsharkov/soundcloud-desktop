import { AudioEngine, EngineSnapshot } from '@/core/audio/AudioEngine';
import { Repeat } from '@/core/audio/types';
import { useMediaSession } from '@/hooks/useMediaSession';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetLocalTrackQuery,
    GetLocalTrackQuerySchema,
    GetSongImageQuery,
    GetSongImageQuerySchema,
} from '@/types/schemas/query';
import {
    GetLocalTrackResponseSchema,
    GetSongImageResponseSchema,
    TrackRow,
} from '@/types/schemas/response';
import { isEqual } from 'lodash';
import React, {
    createContext,
    JSX,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useSyncExternalStore,
} from 'react';

export interface AudioContextType {
    /** DOM ref exposed for custom controls if desired */
    audioRef: React.RefObject<HTMLAudioElement | null>;

    /** Transport state */
    playbackTime: number;
    duration: number;
    src: string;
    paused: boolean;
    volume: number;

    /** Queue/policy */
    trackIds: number[];
    currentIndex: number;
    shuffled: boolean;
    repeat: Repeat;
    selectedTrackId: number | null;

    /** Transport commands */
    setTime: (time: number) => void;
    reset: () => void;
    setPaused: (paused: boolean) => void;
    setSrc: (src: string) => void;
    setVolume: (v: number) => void;
    setRate: (r: number) => void;

    /** Queue commands */
    setQueue: (trackIds: number[]) => void;
    enqueue: (trackIds: number[] | number) => void;
    enqueueNext: (trackIds: number[] | number) => void;
    removeAt: (index: number) => void;
    clearQueue: () => void;
    setIndex: (index: number) => void;
    next: () => void;
    prev: () => void;
    setRepeat: (repeat: Repeat) => void;
    toggleShuffle: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
    const ctx = useContext(AudioContext);
    if (!ctx) throw new Error('useAudio must be used within an AudioProvider');
    return ctx;
};

export interface AudioProviderProps {
    children: React.ReactNode;
}

export const AudioProvider = (props: AudioProviderProps): JSX.Element => {
    const { children } = props;
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const engineRef = useRef<AudioEngine>(new AudioEngine());
    const lastSnapshotRef = useRef<EngineSnapshot | null>(null);

    // Create stable references to avoid infinite loops
    const subscribe = useCallback((fn: () => void) => {
        return engineRef.current.subscribe(fn);
    }, []);

    const getSnapshot = useCallback(() => {
        const newSnapshot = engineRef.current.getSnapshot();

        if (
            lastSnapshotRef.current &&
            isEqual(lastSnapshotRef.current, newSnapshot)
        ) {
            return lastSnapshotRef.current;
        }

        lastSnapshotRef.current = newSnapshot;
        return newSnapshot;
    }, []);

    // Single subscription: engine unifies queue + transport
    const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    // Create stable command functions to avoid unnecessary re-renders
    const setTime = useCallback(
        (t: number) => engineRef.current.setTime(t),
        []
    );
    const reset = useCallback(() => engineRef.current.reset(), []);
    const setPaused = useCallback(
        (p: boolean) => engineRef.current.setPaused(p),
        []
    );
    const setSrc = useCallback((s: string) => engineRef.current.setSrc(s), []);
    const setVolume = useCallback(
        (v: number) => engineRef.current.setVolume(v),
        []
    );
    const setRate = useCallback(
        (r: number) => engineRef.current.setRate(r),
        []
    );
    const setQueue = useCallback(
        (trackIds: number[]) => engineRef.current.setQueue(trackIds),
        []
    );
    const enqueue = useCallback(
        (t: number[] | number) => engineRef.current.enqueue(t),
        []
    );
    const enqueueNext = useCallback(
        (t: number[] | number) => engineRef.current.enqueueNext(t),
        []
    );
    const removeAt = useCallback(
        (i: number) => engineRef.current.removeAt(i),
        []
    );
    const clearQueue = useCallback(() => engineRef.current.clearQueue(), []);
    const setIndex = useCallback(
        (i: number) => engineRef.current.setIndex(i),
        []
    );
    const next = useCallback(() => engineRef.current.next(), []);
    const prev = useCallback(() => engineRef.current.prev(), []);
    const setRepeat = useCallback(
        (r: Repeat) => engineRef.current.setRepeat(r),
        []
    );
    const toggleShuffle = useCallback(
        () => engineRef.current.toggleShuffle(),
        []
    );

    // Fetch current track metadata for Media Session
    const { data: currentTrack } = useTauriQuery<GetLocalTrackQuery, TrackRow>(
        'get_local_track',
        snap.selectedTrackId ? { id: snap.selectedTrackId } : undefined,
        {
            querySchema: GetLocalTrackQuerySchema,
            responseSchema: GetLocalTrackResponseSchema,
            enabled: snap.selectedTrackId !== null,
        }
    );

    // Fetch artwork for Media Session
    const { data: artwork } = useTauriQuery<GetSongImageQuery, string>(
        'get_song_image',
        snap.selectedTrackId ? { id: snap.selectedTrackId } : undefined,
        {
            querySchema: GetSongImageQuerySchema,
            responseSchema: GetSongImageResponseSchema,
            enabled: snap.selectedTrackId !== null,
        }
    );

    // Prepare Media Session metadata
    const mediaSessionMetadata = useMemo(() => {
        if (!currentTrack || !artwork) {
            return null;
        }
        return {
            title: currentTrack.title,
            artist: currentTrack.artist,
            artwork: artwork,
        };
    }, [currentTrack, artwork]);

    // Set up Media Session
    useMediaSession({
        metadata: mediaSessionMetadata,
        paused: snap.paused,
        duration: snap.duration,
        playbackTime: snap.playbackTime,
        actions: {
            onPlay: () => setPaused(false),
            onPause: () => setPaused(true),
            onNext: () => next(),
            onPrevious: () => prev(),
        },
    });

    useEffect(() => {
        // Use a timeout to ensure the audio element is properly mounted
        const timeoutId = setTimeout(() => {
            if (audioRef.current) {
                engineRef.current.attach(audioRef.current);
            }
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            engineRef.current.attach(null);
        };
    }, []);

    const value: AudioContextType = {
        audioRef,

        // transport state
        playbackTime: snap.playbackTime,
        duration: snap.duration,
        src: snap.src,
        paused: snap.paused,
        volume: snap.volume,

        // queue state
        trackIds: snap.trackIds,
        currentIndex: snap.currentIndex,
        shuffled: snap.shuffled,
        repeat: snap.repeat,
        selectedTrackId: snap.selectedTrackId,

        // transport commands
        setTime,
        reset,
        setPaused,
        setSrc,
        setVolume,
        setRate,

        // queue commands
        setQueue,
        enqueue,
        enqueueNext,
        removeAt,
        clearQueue,
        setIndex,
        next,
        prev,
        setRepeat,
        toggleShuffle,
    };

    return <AudioContext value={value}>{children}</AudioContext>;
};
