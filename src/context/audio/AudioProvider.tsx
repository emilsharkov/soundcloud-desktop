import {
    AudioContext,
    type AudioContextType,
} from '@/context/audio/AudioContext';
import { AudioEngine, EngineSnapshot } from '@/models/audio/AudioEngine';
import { Repeat } from '@/models/audio/repeat';
import { isEqual } from 'lodash';
import React, {
    JSX,
    useCallback,
    useEffect,
    useRef,
    useSyncExternalStore,
} from 'react';

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

        console.log('AudioProvider: State changed, new snapshot:', {
            shuffled: newSnapshot.shuffled,
            repeat: newSnapshot.repeat,
            trackIds: newSnapshot.trackIds,
        });
        lastSnapshotRef.current = newSnapshot;
        return newSnapshot;
    }, []);

    // Single subscription: engine unifies queue + transport
    const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

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
