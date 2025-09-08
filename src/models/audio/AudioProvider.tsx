import React, { JSX, useEffect, useRef, useSyncExternalStore, useCallback } from "react";
import { AudioContext, type AudioContextType } from "./AudioContext";
import { AudioEngine } from "./AudioEngine";
import { Track } from "../response";
import { Repeat } from "./repeat";

export interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider = (props: AudioProviderProps): JSX.Element => {
  const { children } = props;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<AudioEngine>(new AudioEngine());
  const lastSnapshotRef = useRef<any>(null);

  // Create stable references to avoid infinite loops
  const subscribe = useCallback((fn: () => void) => {
    return engineRef.current.subscribe(fn);
  }, []);

  const getSnapshot = useCallback(() => {
    const newSnapshot = engineRef.current.getSnapshot();
    
    // Check if the snapshot has actually changed by comparing key values
    if (lastSnapshotRef.current) {
      const last = lastSnapshotRef.current;
      const hasChanged = 
        last.playbackTime !== newSnapshot.playbackTime ||
        last.duration !== newSnapshot.duration ||
        last.src !== newSnapshot.src ||
        last.paused !== newSnapshot.paused ||
        last.tracks !== newSnapshot.tracks ||
        last.currentIndex !== newSnapshot.currentIndex ||
        last.shuffled !== newSnapshot.shuffled ||
        last.repeat !== newSnapshot.repeat;
      
      if (!hasChanged) {
        return lastSnapshotRef.current;
      }
    }
    
    // Create a new snapshot object to avoid reference issues
    const cachedSnapshot = {
      playbackTime: newSnapshot.playbackTime,
      duration: newSnapshot.duration,
      src: newSnapshot.src,
      paused: newSnapshot.paused,
      tracks: newSnapshot.tracks,
      currentIndex: newSnapshot.currentIndex,
      shuffled: newSnapshot.shuffled,
      repeat: newSnapshot.repeat,
    };
    
    lastSnapshotRef.current = cachedSnapshot;
    return cachedSnapshot;
  }, []);

  // Single subscription: engine unifies queue + transport
  const snap = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot, // server snapshot (same as client for this use case)
  );

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
  const setTime = useCallback((t: number) => engineRef.current.setTime(t), []);
  const reset = useCallback(() => engineRef.current.reset(), []);
  const setPaused = useCallback((p: boolean) => engineRef.current.setPaused(p), []);
  const setSrc = useCallback((s: string) => engineRef.current.setSrc(s), []);
  const setVolume = useCallback((v: number) => engineRef.current.setVolume(v), []);
  const setRate = useCallback((r: number) => engineRef.current.setRate(r), []);
  const setQueue = useCallback((tracks: Track[]) => engineRef.current.setQueue(tracks), []);
  const enqueue = useCallback((t: Track[] | Track) => engineRef.current.enqueue(t), []);
  const enqueueNext = useCallback((t: Track[] | Track) => engineRef.current.enqueueNext(t), []);
  const removeAt = useCallback((i: number) => engineRef.current.removeAt(i), []);
  const clearQueue = useCallback(() => engineRef.current.clearQueue(), []);
  const setIndex = useCallback((i: number) => engineRef.current.setIndex(i), []);
  const next = useCallback(() => engineRef.current.next(), []);
  const prev = useCallback(() => engineRef.current.prev(), []);
  const setShuffled = useCallback((on: boolean) => engineRef.current.setShuffled(on), []);
  const setRepeat = useCallback((r: Repeat) => engineRef.current.setRepeat(r), []);
  const toggleShuffle = useCallback(() => engineRef.current.toggleShuffle(), []);

  const value: AudioContextType = {
    audioRef,

    // transport state
    playbackTime: snap.playbackTime,
    duration: snap.duration,
    src: snap.src,
    paused: snap.paused,

    // queue state
    tracks: snap.tracks,
    currentIndex: snap.currentIndex,
    shuffled: snap.shuffled,
    repeat: snap.repeat,

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
    setShuffled,
    setRepeat,
    toggleShuffle,
  };

  return (
    <AudioContext value={value}>
      {children}
    </AudioContext>
  );
};
