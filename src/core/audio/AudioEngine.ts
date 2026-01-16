import { TrackRow } from '@/types/schemas';
import { invoke } from '@tauri-apps/api/core';
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';
import { AudioTransport, type TransportSnapshot } from './AudioTransport';
import { PlayerQueue, type QueueSnapshot } from './PlayerQueue';
import { Repeat } from './types';

export type EngineSnapshot = QueueSnapshot & TransportSnapshot;

/**
 * Facade that owns a PlayerQueue and an AudioTransport, wires them together,
 * and exposes a single subscribe/getSnapshot pair + unified commands.
 */
export class AudioEngine {
    readonly queue: PlayerQueue;
    readonly transport: AudioTransport;

    private listeners = new Set<() => void>();
    private currentTrackId: number | null = null;

    constructor(queue = new PlayerQueue(), transport = new AudioTransport()) {
        this.queue = queue;
        this.transport = transport;

        // 1) React to transport ended → apply queue policy
        this.transport.setEndedHandler(() => {
            const q = this.queue.getSnapshot();
            if (q.repeat === 'song') {
                this.transport.setTime(0);
                void this.transport.setPaused(false);
                return;
            }
            const currentId = q.selectedTrackId;
            this.queue.next();
            const after = this.queue.getSnapshot();
            if (
                after.repeat === 'songs' &&
                after.selectedTrackId === currentId
            ) {
                this.transport.setTime(0);
                void this.transport.setPaused(false);
            }
        });

        // 2) When queue selection changes → load src & continue playing if not paused
        const handleQueueChange = async () => {
            const q = this.queue.getSnapshot();

            // Only reload if the current track actually changed
            const newTrackId = q.selectedTrackId;
            if (newTrackId === this.currentTrackId) {
                // No track change: still emit so UI can react to queue-only changes
                // such as shuffled/repeat toggles or order updates.
                this.emit();
                return;
            }

            this.currentTrackId = newTrackId;
            this.transport.setPaused(true);

            if (!newTrackId) {
                this.transport.setSrc('');
            } else {
                try {
                    const trackRow = await invoke<TrackRow>('get_local_track', {
                        id: newTrackId,
                    }).catch(() => {
                        return undefined;
                    });

                    if (trackRow) {
                        const file = await readFile(`music/${newTrackId}.mp3`, {
                            baseDir: BaseDirectory.AppLocalData,
                        });
                        const blob = new Blob([file], { type: 'audio/mpeg' });
                        const url = URL.createObjectURL(blob);
                        this.transport.setSrc(url);
                    } else {
                        // Fetch stream URL from SoundCloud API
                        const streamUrl = await invoke<string>(
                            'get_stream_url',
                            {
                                id: newTrackId,
                            }
                        );
                        this.transport.setSrc(streamUrl);
                    }

                    this.transport.setPaused(false);
                } catch {
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
    setQueue = (trackIds: number[]) => this.queue.setQueue(trackIds);
    enqueue = (t: number[] | number) => this.queue.enqueue(t);
    enqueueNext = (t: number[] | number) => this.queue.enqueueNext(t);
    removeAt = (i: number) => this.queue.removeAt(i);
    clearQueue = () => this.queue.clear();
    setIndex = (i: number) => this.queue.setIndex(i);
    next = () => this.queue.next();
    prev = () => this.queue.prev();
    toggleShuffle = () => this.queue.toggleShuffle();
    setRepeat = (r: Repeat) => this.queue.setRepeat(r);
}
