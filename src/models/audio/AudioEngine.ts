// =======================
// File: src/audio/AudioEngine.ts
// =======================
import { invoke } from '@tauri-apps/api/core';
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';
import { Track } from '../response';
import { AudioTransport, type TransportSnapshot } from './AudioTransport';
import { PlayerQueue, type QueueSnapshot } from './PlayerQueue';
import { Repeat } from './repeat';

export type EngineSnapshot = QueueSnapshot & TransportSnapshot;

/**
 * Facade that owns a PlayerQueue and an AudioTransport, wires them together,
 * and exposes a single subscribe/getSnapshot pair + unified commands.
 */
export class AudioEngine {
    readonly queue: PlayerQueue;
    readonly transport: AudioTransport;

    private listeners = new Set<() => void>();

    constructor(queue = new PlayerQueue(), transport = new AudioTransport()) {
        this.queue = queue;
        this.transport = transport;

        // 1) React to transport ended → apply queue policy
        this.transport.setEndedHandler(() => {
            const q = this.queue.getSnapshot();
            if (q.repeat === 'song') {
                this.transport.setTime(0);
                void this.transport.setPaused(false);
            } else {
                this.queue.next();
            }
        });

        // 2) When queue selection changes → load src & continue playing if not paused
        const handleQueueChange = async () => {
            const q = this.queue.getSnapshot();
            const currentTrack =
                q.currentIndex >= 0 ? q.tracks[q.currentIndex] : null;
            this.transport.setPaused(true);

            if (!currentTrack) {
                this.transport.setSrc('');
            } else {
                const trackId = currentTrack.id;
                try {
                    const track = await invoke<Track>('get_local_track', {
                        id: trackId?.toString() || '',
                    }).catch(() => {
                        return undefined;
                    });

                    if (track) {
                        const file = await readFile(`music/${trackId}.mp3`, {
                            baseDir: BaseDirectory.AppLocalData,
                        });
                        const blob = new Blob([file], { type: 'audio/mpeg' });
                        const url = URL.createObjectURL(blob);
                        this.transport.setSrc(url);
                    } else {
                        const streamUrl = await invoke<string>(
                            'get_stream_url',
                            {
                                track: currentTrack,
                            }
                        );
                        this.transport.setSrc(streamUrl);
                    }

                    console.log('paused');
                    this.transport.setPaused(false);
                } catch {
                    console.log('below');
                    toast.error('Failed to load track');
                }
            }
        };

        const handleTransportChange = () => {
            // No queue change needed; just re-emit combined snapshot
            this.emit();
        };

        // Subscribe to inner stores and re-emit to engine subscribers
        this.queue.subscribe(handleQueueChange);
        this.transport.subscribe(handleTransportChange);
    }

    /** Attach/detach the real <audio> element to the internal transport */
    attach(el: HTMLAudioElement | null) {
        this.transport.attach(el);
        // Don't emit here - the transport will handle the emission
    }

    /** React-friendly subscribe */
    subscribe = (fn: () => void) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    };
    private emit() {
        for (const l of this.listeners) l();
    }

    /** Combined snapshot */
    getSnapshot = (): EngineSnapshot => {
        const q = this.queue.getSnapshot();
        const t = this.transport.getSnapshot();
        return { ...q, ...t };
    };

    // ===== Transport API (proxy to transport) =====
    setTime = (time: number) => this.transport.setTime(time);
    reset = () => this.transport.reset();
    setPaused = (paused: boolean) => this.transport.setPaused(paused);
    setSrc = (src: string) => this.transport.setSrc(src);
    setVolume = (v: number) => this.transport.setVolume(v);
    setRate = (r: number) => this.transport.setRate(r);

    // ===== Queue API (proxy to queue) =====
    setQueue = (tracks: Track[]) => this.queue.setQueue(tracks);
    enqueue = (t: Track[] | Track) => this.queue.enqueue(t);
    enqueueNext = (t: Track[] | Track) => this.queue.enqueueNext(t);
    removeAt = (i: number) => this.queue.removeAt(i);
    clearQueue = () => this.queue.clear();
    setIndex = (i: number) => this.queue.setIndex(i);
    next = () => this.queue.next();
    prev = () => this.queue.prev();
    setShuffled = (on: boolean) => this.queue.setShuffled(on);
    toggleShuffle = () => this.queue.toggleShuffle();
    setRepeat = (r: Repeat) => this.queue.setRepeat(r);
}
