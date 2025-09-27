import { Repeat } from '@/models/audio/repeat';
import React, { createContext, useContext } from 'react';

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

export const AudioContext = createContext<AudioContextType | null>(null);

export const useAudioContext = () => {
    const ctx = useContext(AudioContext);
    if (!ctx)
        throw new Error('useAudioContext must be used within an AudioProvider');
    return ctx;
};
